from app.core.errors import ApiError
from app.extensions import db
from app.models import Application, Client, Loan, Note
from app.models.base import utcnow
from app.services.activity import record


def update_contact(client: Client, actor: str, changes: dict[str, str]) -> None:
    labels = {"first_name": "first name", "last_name": "surname", "email": "email", "phone": "phone"}
    changed = []
    for attr, value in changes.items():
        if getattr(client, attr) != value:
            setattr(client, attr, value)
            changed.append(labels[attr])
    if changed:
        record(client, "client_updated", "Updated " + ", ".join(changed), actor)
        db.session.commit()


def set_blacklisted(client: Client, actor: str, blacklisted: bool, reason: str | None) -> None:
    if blacklisted and not (reason or "").strip():
        raise ApiError("Give a reason for blacklisting.", 422, {"reason": ["Required"]})
    if client.blacklisted == blacklisted:
        return
    client.blacklisted = blacklisted
    client.blacklist_reason = reason.strip() if blacklisted and reason else None
    client.blacklisted_at = utcnow() if blacklisted else None
    record(
        client,
        "blacklist",
        f"Blacklisted: {client.blacklist_reason}" if blacklisted else "Removed from blacklist",
        actor,
    )
    db.session.commit()


def add_note(
    client: Client, actor: str, body: str, *, application: Application | None, loan: Loan | None
) -> Note:
    body = body.strip()
    if not body:
        raise ApiError("Write a note first.", 422, {"body": ["Required"]})
    note = Note(
        client=client,
        application_id=application.id if application else None,
        loan_id=loan.id if loan else None,
        body=body[:5000],
        author_email=actor,
    )
    db.session.add(note)
    db.session.commit()
    return note
