"""Model → JSON for staff endpoints. camelCase keys to match the TypeScript frontends."""

from app.models import Application, Client, ContactMessage, Document


def client_out(c: Client) -> dict:
    return {
        "id": str(c.id),
        "firstName": c.first_name,
        "lastName": c.last_name,
        "fullName": c.full_name,
        "idNumber": c.id_number,
        "email": c.email,
        "phone": c.phone,
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
