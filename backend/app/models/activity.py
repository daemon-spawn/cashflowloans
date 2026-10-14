import uuid

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Model


class Activity(Model):
    """Audit trail: who did what, when. Written by the services, never edited."""

    __tablename__ = "activities"

    client_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("clients.id", ondelete="CASCADE"), index=True)
    application_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("applications.id", ondelete="SET NULL"), index=True
    )
    loan_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("loans.id", ondelete="SET NULL"), index=True)
    kind: Mapped[str] = mapped_column(String(40))
    message: Mapped[str] = mapped_column(Text)
    actor: Mapped[str] = mapped_column(String(255))
