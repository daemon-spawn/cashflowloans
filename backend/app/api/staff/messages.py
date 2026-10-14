from flask import request
from sqlalchemy import select

from app.api.staff import bp
from app.api.staff._util import get_or_404, parse
from app.core.errors import ApiError
from app.extensions import db
from app.models import ContactMessage, MessageStatus
from app.schemas.serializers import message_out
from app.schemas.staff import MessageStatusIn


@bp.get("/messages")
def list_messages():
    query = select(ContactMessage).order_by(ContactMessage.created_at.desc()).limit(500)
    if status := request.args.get("status"):
        try:
            query = query.where(ContactMessage.status == MessageStatus(status))
        except ValueError as exc:
            raise ApiError("Unknown status", 422) from exc
    return {"items": [message_out(m) for m in db.session.scalars(query)]}


@bp.patch("/messages/<message_id>")
def update_message(message_id: str):
    body = parse(MessageStatusIn)
    message = get_or_404(ContactMessage, message_id, "Message")
    message.status = body.status
    db.session.commit()
    return message_out(message)
