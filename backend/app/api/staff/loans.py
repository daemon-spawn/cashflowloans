from flask import g, request
from sqlalchemy import or_, select
from sqlalchemy.orm import selectinload

from app.api.staff import bp
from app.api.staff._util import get_or_404, parse
from app.core.errors import ApiError
from app.extensions import db
from app.models import Activity, Application, Client, Loan, LoanStatus, Note, Payment
from app.schemas.serializers import activity_out, loan_out, note_out, payment_out
from app.schemas.staff import CollateralIn, PaymentIn, PayoutIn, WriteOffIn
from app.services import loans as service

_LOAD = (selectinload(Loan.payments), selectinload(Loan.client), selectinload(Loan.application))


def _get(loan_id: str) -> Loan:
    return get_or_404(Loan, loan_id, "Loan", options=_LOAD)


def _detail(loan: Loan) -> dict:
    status, ledger = service.current_state(loan)
    notes = db.session.scalars(
        select(Note).where(Note.loan_id == loan.id).order_by(Note.created_at.desc())
    ).all()
    activity = db.session.scalars(
        select(Activity).where(Activity.loan_id == loan.id).order_by(Activity.created_at.desc())
    ).all()
    return {
        **loan_out(loan, status, ledger, detail=True),
        "notes": [note_out(n) for n in notes],
        "activity": [activity_out(a) for a in activity],
    }


@bp.get("/loans")
def list_loans():
    query = select(Loan).options(*_LOAD).order_by(Loan.due_date.asc().nulls_first(), Loan.created_at.desc())
    if q := (request.args.get("q") or "").strip():
        like = f"%{q}%"
        query = (
            query.join(Loan.client)
            .outerjoin(Loan.application)
            .where(
                or_(
                    Application.reference.ilike(like),
                    Client.first_name.ilike(like),
                    Client.last_name.ilike(like),
                    Client.id_number.ilike(like),
                    Client.phone.ilike(like),
                )
            )
        )
    wanted = request.args.get("status")
    if wanted:
        try:
            wanted = LoanStatus(wanted)
        except ValueError as exc:
            raise ApiError("Unknown status", 422) from exc
    items = []
    for ln in db.session.scalars(query.limit(1000)):
        status, ledger = service.current_state(ln)
        if wanted and status != wanted:
            continue
        items.append(loan_out(ln, status, ledger))
    return {"items": items}


@bp.get("/loans/<loan_id>")
def get_loan(loan_id: str):
    return _detail(_get(loan_id))


@bp.post("/loans/<loan_id>/payout")
def pay_out(loan_id: str):
    body = parse(PayoutIn)
    loan = _get(loan_id)
    service.pay_out(loan, g.staff_email, paid_out_on=body.paid_out_on, due_date=body.due_date)
    return _detail(loan)


@bp.post("/loans/<loan_id>/payments")
def add_payment(loan_id: str):
    body = parse(PaymentIn)
    loan = _get(loan_id)
    payment = service.record_payment(
        loan,
        g.staff_email,
        amount=body.amount,
        paid_on=body.paid_on,
        method=body.method,
        reference=body.reference,
        notes=body.notes,
    )
    return {"payment": payment_out(payment), "loan": _detail(loan)}, 201


@bp.delete("/loans/<loan_id>/payments/<payment_id>")
def remove_payment(loan_id: str, payment_id: str):
    loan = _get(loan_id)
    payment = get_or_404(Payment, payment_id, "Payment")
    if payment.loan_id != loan.id:
        raise ApiError("Payment not found", 404)
    service.delete_payment(loan, payment, g.staff_email)
    return _detail(loan)


@bp.post("/loans/<loan_id>/write-off")
def write_off(loan_id: str):
    body = parse(WriteOffIn)
    loan = _get(loan_id)
    service.write_off(loan, g.staff_email, body.reason)
    return _detail(loan)


@bp.patch("/loans/<loan_id>/collateral")
def update_collateral(loan_id: str):
    body = parse(CollateralIn)
    loan = _get(loan_id)
    service.update_collateral(loan, g.staff_email, status=body.status, description=body.description)
    return _detail(loan)


@bp.get("/clients/<client_id>/loans")
def client_loans(client_id: str):
    client = get_or_404(Client, client_id, "Client")
    loans = db.session.scalars(select(Loan).where(Loan.client_id == client.id).options(*_LOAD)).all()
    return {"items": [loan_out(ln, *service.current_state(ln)) for ln in loans]}
