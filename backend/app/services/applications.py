"""Intake of public loan applications."""

import secrets
import uuid

from sqlalchemy import select

from app.core.errors import ApiError
from app.extensions import db
from app.models import Application, Client, Document
from app.models.base import utcnow
from app.schemas.application import ApplicationIn
from app.services.notifications import notify_owner
from app.services.storage import get_storage
from app.services.uploads import UploadedFile

_REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"  # no 0/O/1/I confusion on the phone


def new_reference() -> str:
    return "CFL-" + "".join(secrets.choice(_REF_ALPHABET) for _ in range(6))


def upsert_client(data: ApplicationIn) -> Client:
    """Repeat applicants keep one client record; contact details are refreshed."""
    client = db.session.scalar(select(Client).where(Client.id_number == data.id_number))
    if client is None:
        client = Client(id_number=data.id_number)
        db.session.add(client)
    client.first_name = data.first_name
    client.last_name = data.last_name
    client.email = str(data.email).lower()
    client.phone = data.phone
    return client


def create_application(data: ApplicationIn, uploads: list[UploadedFile]) -> Application:
    storage = get_storage()
    client = upsert_client(data)
    db.session.flush()

    application = Application(
        id=uuid.uuid4(),
        reference=new_reference(),
        client=client,
        loan_type=data.loan_type,
        amount=data.amount,
        requested_repayment_date=data.repayment_date,
        accepted_terms_at=utcnow(),
    )
    db.session.add(application)

    uploaded: list[str] = []
    try:
        for f in uploads:
            folder = f"clients/{client.id}/applications/{application.id}"
            path = f"{folder}/{f.kind.value}-{uuid.uuid4().hex[:8]}.{f.extension}"
            storage.upload(path, f.data, f.content_type)
            uploaded.append(path)
            db.session.add(
                Document(
                    client=client,
                    application=application,
                    kind=f.kind,
                    storage_path=path,
                    original_filename=f.filename[:255],
                    content_type=f.content_type,
                    size_bytes=len(f.data),
                )
            )
        db.session.commit()
    except Exception as exc:
        # All or nothing: never keep an application whose documents are missing.
        db.session.rollback()
        storage.delete(uploaded)
        raise ApiError("We couldn't save your documents. Please try again.", 503) from exc

    notify_owner(
        f"New {application.loan_type.value} application {application.reference} — R{application.amount}",
        f"{client.full_name} ({client.phone}, {client.email}) applied for R{application.amount}.\n"
        f"Documents: {len(uploads)}. Open the CRM to review.",
    )
    return application
