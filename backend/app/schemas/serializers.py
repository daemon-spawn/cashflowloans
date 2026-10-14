"""Model → JSON for staff endpoints. camelCase keys to match the TypeScript frontends."""

from app.core.ledger import Ledger
from app.models import (
    Activity,
    Application,
    Client,
    ContactMessage,
    Document,
    Loan,
    LoanStatus,
    Note,
    Payment,
)
from app.services.loans import paid_out_date


def client_out(c: Client) -> dict:
    return {
        "id": str(c.id),
        "firstName": c.first_name,
        "lastName": c.last_name,
        "fullName": c.full_name,
        "idNumber": c.id_number,
        "email": c.email,
        "phone": c.phone,
        "blacklisted": c.blacklisted,
        "blacklistReason": c.blacklist_reason,
        "createdAt": c.created_at.isoformat(),
    }


def document_out(d: Document, url: str | None = None) -> dict:
    return {
        "id": str(d.id),
        "kind": d.kind.value,
        "filename": d.original_filename,
        "contentType": d.content_type,
        "sizeBytes": d.size_bytes,
        "url": url,
        "createdAt": d.created_at.isoformat(),
    }


def application_out(a: Application) -> dict:
    return {
        "id": str(a.id),
        "reference": a.reference,
        "loanType": a.loan_type.value,
        "amount": str(a.amount),
        "repaymentDate": a.requested_repayment_date.isoformat(),
        "status": a.status.value,
        "declineReason": a.decline_reason,
        "source": a.source,
        "reviewedBy": a.reviewed_by,
        "loanId": str(a.loan.id) if a.loan else None,
        "client": client_out(a.client),
        "createdAt": a.created_at.isoformat(),
    }


def message_out(m: ContactMessage) -> dict:
    return {
        "id": str(m.id),
        "name": m.name,
        "email": m.email,
        "phone": m.phone,
        "subject": m.subject,
        "message": m.message,
        "status": m.status.value,
        "createdAt": m.created_at.isoformat(),
    }


def ledger_out(lg: Ledger) -> dict:
    return {
        "balance": str(lg.balance),
        "paid": str(lg.paid),
        "lateCharges": str(lg.late_charges),
        "missedPeriods": lg.missed_periods,
        "nextDueDate": lg.next_due_date.isoformat() if lg.next_due_date else None,
        "entries": [
            {
                "on": e.on.isoformat(),
                "kind": e.kind,
                "amount": str(e.amount),
                "balance": str(e.balance),
                "label": e.label,
            }
            for e in lg.entries
        ],
    }


def payment_out(p: Payment) -> dict:
    return {
        "id": str(p.id),
        "amount": str(p.amount),
        "paidOn": p.paid_on.isoformat(),
        "method": p.method,
        "reference": p.reference,
        "notes": p.notes,
        "recordedBy": p.recorded_by,
        "createdAt": p.created_at.isoformat(),
    }


def loan_out(ln: Loan, status: LoanStatus, lg: Ledger, *, detail: bool = False) -> dict:
    out = {
        "id": str(ln.id),
        "reference": ln.application.reference if ln.application else None,
        "applicationId": str(ln.application_id) if ln.application_id else None,
        "client": client_out(ln.client),
        "loanType": ln.loan_type.value,
        "principal": str(ln.principal),
        "fee": str(ln.fee),
        "totalRepayable": str(ln.total_repayable),
        "paidOutOn": paid_out_date(ln).isoformat() if ln.disbursed_at else None,
        "paidOutBy": ln.paid_out_by,
        "dueDate": ln.due_date.isoformat() if ln.due_date else None,
        "status": status.value,
        "balance": str(lg.balance),
        "paid": str(lg.paid),
        "lateCharges": str(lg.late_charges),
        "missedPeriods": lg.missed_periods,
        "nextDueDate": lg.next_due_date.isoformat() if lg.next_due_date else None,
        "paidAt": ln.paid_at.isoformat() if ln.paid_at else None,
        "writtenOffAt": ln.written_off_at.isoformat() if ln.written_off_at else None,
        "writtenOffReason": ln.written_off_reason,
        "collateralStatus": ln.collateral_status.value if ln.collateral_status else None,
        "collateralDescription": ln.collateral_description,
        "requestedRepaymentDate": (
            ln.application.requested_repayment_date.isoformat() if ln.application else None
        ),
        "createdAt": ln.created_at.isoformat(),
    }
    if detail:
        out["ledger"] = ledger_out(lg)
        out["payments"] = [payment_out(p) for p in ln.payments]
    return out


def note_out(n: Note) -> dict:
    return {
        "id": str(n.id),
        "body": n.body,
        "author": n.author_email,
        "applicationId": str(n.application_id) if n.application_id else None,
        "loanId": str(n.loan_id) if n.loan_id else None,
        "createdAt": n.created_at.isoformat(),
    }


def activity_out(a: Activity) -> dict:
    return {
        "id": str(a.id),
        "kind": a.kind,
        "message": a.message,
        "actor": a.actor,
        "applicationId": str(a.application_id) if a.application_id else None,
        "loanId": str(a.loan_id) if a.loan_id else None,
        "createdAt": a.created_at.isoformat(),
    }
