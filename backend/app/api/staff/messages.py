from sqlalchemy import select

from app.api.staff import bp
from app.extensions import db
from app.models import ContactMessage
from app.schemas.serializers import message_out


@bp.get("/messages")
def list_messages():
    query = select(ContactMessage).order_by(ContactMessage.created_at.desc()).limit(500)
    return {"items": [message_out(m) for m in db.session.scalars(query)]}
