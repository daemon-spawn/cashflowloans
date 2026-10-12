from flask import request
from pydantic import ValidationError
from sqlalchemy import select

from app.api.public import bp
from app.extensions import db, limiter
from app.models import Client, ContactMessage
from app.schemas import validation_error
from app.schemas.contact import ContactIn
from app.services.notifications import notify_owner
from app.services.turnstile import verify_turnstile


@bp.post("/contact")
@limiter.limit("5 per hour")
def submit_contact():
    body = request.get_json(silent=True) or {}
    verify_turnstile(body.get("turnstileToken"), request.remote_addr)
    try:
        data = ContactIn.model_validate(body)
    except ValidationError as exc:
        raise validation_error(exc) from exc

    email = str(data.email).lower()
    existing = db.session.scalar(select(Client).where(Client.email == email).limit(1))
    message = ContactMessage(
        name=data.name,
        email=email,
        phone=data.phone,
        subject=data.subject,
        message=data.message,
        client_id=existing.id if existing else None,
    )
    db.session.add(message)
    db.session.commit()

    notify_owner(
        f"Website enquiry from {data.name}", f"{data.name} <{email}> {data.phone or ''}\n\n{data.message}"
    )
    return {"ok": True}, 201
