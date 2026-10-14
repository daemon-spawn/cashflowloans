"""
Loan lifecycle: approve → (loan created) → paid out → payments → paid / written off.

Every change records an Activity and refreshes the stored status, which is
always derived from the ledger (app.core.ledger), never set by hand.
"""

from datetime import UTC, date, datetime, time
from decimal import Decimal

from app.core import clock, loan_rules
from app.core.errors import ApiError
from app.core.ledger import Ledger, build_ledger, loan_status
from app.extensions import db
from app.models import (
    Application,
    ApplicationStatus,
    CollateralStatus,
    Loan,
    LoanStatus,
    LoanType,
    Payment,
)
from app.models.base import utcnow
from app.services import emails
from app.services.activity import record
from app.services.notifications import send_email

PAYMENT_METHODS = ("eft", "debicheck", "cash")


def ledger_for(loan: Loan, today: date | None = None) -> Ledger:
    return build_ledger(
        loan.principal,
        loan.fee,
        paid_out_date(loan),
        loan.due_date,
        [(p.paid_on, p.amount) for p in loan.payments],
        today or clock.today(),
    )


def paid_out_date(loan: Loan) -> date | None:
    return loan.disbursed_at.astimezone(clock.SAST).date() if loan.disbursed_at else None


def current_state(loan: Loan, today: date | None = None) -> tuple[LoanStatus, Ledger]:
    """Status and ledger as of today, without changing the loan."""
    today = today or clock.today()
    ledger = ledger_for(loan, today)
    status = loan_status(
        ledger,
        paid_out=loan.disbursed_at is not None,
        written_off=loan.written_off_at is not None,
        due_date=loan.due_date,
        today=today,
    )
    return status, ledger


def refresh_status(loan: Loan, today: date | None = None) -> Ledger:
    loan.status, ledger = current_state(loan, today)
    if loan.status == LoanStatus.PAID and loan.paid_at is None:
        loan.paid_at = utcnow()
    elif loan.status != LoanStatus.PAID:
        loan.paid_at = None
    return ledger


def reference_for(loan: Loan) -> str:
    return loan.application.reference if loan.application else str(loan.id)[:8].upper()


# --- Applications -----------------------------------------------------------------


def set_application_status(
    app: Application, status: ApplicationStatus, actor: str, *, decline_reason: str | None, override: bool
) -> None:
    if app.status == status:
        return
    loan = app.loan
    if loan is not None and loan.disbursed_at is not None:
        raise ApiError("This loan has already been paid out, so the application can't change.", 409)

    if status == ApplicationStatus.APPROVED:
        if app.client.blacklisted and not override:
            raise ApiError(
                f"{app.client.full_name} is blacklisted. Approve anyway?", 409, {"override": ["required"]}
            )
        _approve(app, actor)
    else:
        if loan is not None:  # approved but not paid out yet: undo the pending loan
            db.session.delete(loan)
            record(app.client, "loan_cancelled", "Pending loan cancelled", actor, application=app)
        if status == ApplicationStatus.DECLINED:
            app.decline_reason = (decline_reason or "").strip() or None

    previous = app.status
    app.status = status
    app.reviewed_by = actor
    if status != ApplicationStatus.DECLINED:
        app.decline_reason = None
    record(
        app.client,
        "application_status",
        f"Application {app.reference}: {previous.value.replace('_', ' ')} → {status.value.replace('_', ' ')}"
        + (f" ({app.decline_reason})" if app.decline_reason else ""),
        actor,
        application=app,
    )
    db.session.commit()

    if status == ApplicationStatus.APPROVED:
        send_email(
            app.client.email, *emails.application_approved(app.client.first_name, app.reference, app.amount)
        )
    elif status == ApplicationStatus.DECLINED:
        send_email(app.client.email, *emails.application_declined(app.client.first_name, app.reference))


def _approve(app: Application, actor: str) -> Loan:
    """Approval creates the loan straight away; it waits for payout."""
    loan = Loan(
        client=app.client,
        application=app,
        loan_type=app.loan_type,
        principal=loan_rules.money(app.amount),
        fee=loan_rules.fee_for(app.amount),
        status=LoanStatus.PENDING_PAYOUT,
        collateral_status=CollateralStatus.AWAITING_COLLECTION if app.loan_type == LoanType.SECURED else None,
    )
    db.session.add(loan)
    db.session.flush()
    record(
        app.client,
        "loan_created",
        f"Loan created for {emails.rand(loan.principal)}",
        actor,
        application=app,
        loan=loan,
    )
    return loan


# --- Payout, payments, write-off ---------------------------------------------------


def default_due_date(loan: Loan, paid_out_on: date) -> date:
    """One month from payout, or the applicant's chosen date if that is sooner."""
    term_end = clock.add_months(paid_out_on, loan_rules.TERM_MONTHS)
    requested = loan.application.requested_repayment_date if loan.application else None
    if requested and paid_out_on < requested < term_end:
        return requested
    return term_end


def pay_out(loan: Loan, actor: str, *, paid_out_on: date | None, due_date: date | None) -> Ledger:
    if loan.disbursed_at is not None:
        raise ApiError("This loan has already been paid out.", 409)
    if loan.written_off_at is not None:
        raise ApiError("This loan was written off.", 409)
    paid_out_on = paid_out_on or clock.today()
    if paid_out_on > clock.today():
        raise ApiError("The payout date can't be in the future.", 422, {"paidOutOn": ["In the future"]})
    due_date = due_date or default_due_date(loan, paid_out_on)
    if due_date <= paid_out_on:
        raise ApiError("The due date must be after the payout date.", 422, {"dueDate": ["Before payout"]})

    loan.disbursed_at = datetime.combine(paid_out_on, time(12), tzinfo=clock.SAST).astimezone(UTC)
    loan.due_date = due_date
    loan.paid_out_by = actor
    ledger = refresh_status(loan)
    record(
        loan.client,
        "loan_paid_out",
        f"Paid out {emails.rand(loan.principal)} on {emails.short_date(paid_out_on)}, "
        f"{emails.rand(loan.total_repayable)} due {emails.short_date(due_date)}",
        actor,
        application=loan.application,
        loan=loan,
    )
    db.session.commit()
    send_email(
        loan.client.email,
        *emails.loan_paid_out(loan.client.first_name, reference_for(loan), loan.total_repayable, due_date),
    )
    return ledger


def record_payment(
    loan: Loan,
    actor: str,
    *,
    amount: Decimal,
    paid_on: date | None,
    method: str,
    reference: str | None,
    notes: str | None,
) -> Payment:
    if loan.disbursed_at is None:
        raise ApiError("Mark the loan as paid out before recording payments.", 409)
    if loan.written_off_at is not None:
        raise ApiError("This loan was written off.", 409)
    amount = loan_rules.money(amount)
    if amount <= 0:
        raise ApiError("Enter an amount above R0.", 422, {"amount": ["Must be above R0"]})
    if method not in PAYMENT_METHODS:
        raise ApiError("Unknown payment method.", 422, {"method": [f"One of {', '.join(PAYMENT_METHODS)}"]})
    paid_on = paid_on or clock.today()
    if paid_on > clock.today():
        raise ApiError("The payment date can't be in the future.", 422, {"paidOn": ["In the future"]})
    if paid_on < paid_out_date(loan):
        raise ApiError("The payment date is before the payout.", 422, {"paidOn": ["Before payout"]})

    # Check against what was owed on the payment date, not today.
    owed = build_ledger(
        loan.principal,
        loan.fee,
        paid_out_date(loan),
        loan.due_date,
        [(p.paid_on, p.amount) for p in loan.payments],
        paid_on,
    ).balance
    if amount > owed:
        raise ApiError(
            f"That's more than the {emails.rand(owed)} owed on {emails.short_date(paid_on)}.",
            422,
            {"amount": [f"At most {emails.rand(owed)}"]},
        )

    payment = Payment(
        loan=loan,
        amount=amount,
        paid_on=paid_on,
        method=method,
        reference=(reference or "").strip() or None,
        notes=(notes or "").strip() or None,
        recorded_by=actor,
    )
    db.session.add(payment)
    db.session.flush()
    ledger = refresh_status(loan)
    record(
        loan.client,
        "payment",
        f"Payment of {emails.rand(amount)} ({method}) on {emails.short_date(paid_on)}; "
        f"balance {emails.rand(ledger.balance)}",
        actor,
        application=loan.application,
        loan=loan,
    )
    settled = loan.status == LoanStatus.PAID
    if settled:
        record(loan.client, "loan_paid", "Loan paid in full", actor, application=loan.application, loan=loan)
    db.session.commit()
    if settled:
        send_email(loan.client.email, *emails.loan_settled(loan.client.first_name, reference_for(loan)))
    return payment


def delete_payment(loan: Loan, payment: Payment, actor: str) -> None:
    """For correcting mistakes; the activity log keeps the record."""
    loan.payments.remove(payment)
    db.session.flush()
    refresh_status(loan)
    record(
        loan.client,
        "payment_deleted",
        f"Removed payment of {emails.rand(payment.amount)} from {emails.short_date(payment.paid_on)}",
        actor,
        application=loan.application,
        loan=loan,
    )
    db.session.commit()


def write_off(loan: Loan, actor: str, reason: str) -> None:
    if loan.written_off_at is not None:
        return
    if not reason.strip():
        raise ApiError("Give a reason for writing off the loan.", 422, {"reason": ["Required"]})
    balance = ledger_for(loan).balance
    loan.written_off_at = utcnow()
    loan.written_off_reason = reason.strip()
    refresh_status(loan)
    record(
        loan.client,
        "loan_written_off",
        f"Written off with {emails.rand(balance)} outstanding: {reason.strip()}",
        actor,
        application=loan.application,
        loan=loan,
    )
    db.session.commit()


def update_collateral(
    loan: Loan, actor: str, *, status: CollateralStatus | None, description: str | None
) -> None:
    if loan.loan_type != LoanType.SECURED:
        raise ApiError("Only secured loans have collateral.", 409)
    changes = []
    if status is not None and status != loan.collateral_status:
        loan.collateral_status = status
        changes.append(f"status {status.value.replace('_', ' ')}")
    if description is not None and description.strip() != (loan.collateral_description or ""):
        loan.collateral_description = description.strip() or None
        changes.append("description updated")
    if changes:
        record(
            loan.client,
            "collateral",
            "Collateral: " + ", ".join(changes),
            actor,
            application=loan.application,
            loan=loan,
        )
        db.session.commit()
