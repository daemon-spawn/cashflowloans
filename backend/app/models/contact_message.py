import uuid

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Model, enum_column
from app.models.enums import MessageStatus


class ContactMessage(Model):
    """An enquiry from the website contact form."""

    __tablename__ = "contact_messages"

    name: Mapped[str] = mapped_column(String(200))
    email: Mapped[str] = mapped_column(String(255))
    phone: Mapped[str | None] = mapped_column(String(20))
    subject: Mapped[str | None] = mapped_column(String(150))
    message: Mapped[str] = mapped_column(Text)
    status: Mapped[MessageStatus] = mapped_column(
        enum_column(MessageStatus), default=MessageStatus.NEW, index=True
    )
    client_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("clients.id", ondelete="SET NULL"))
