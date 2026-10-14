import uuid

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Model


class ReminderLog(Model):
    """One row per reminder sent, so the daily job never sends the same one twice."""

    __tablename__ = "reminder_logs"

    key: Mapped[str] = mapped_column(String(120), unique=True)  # e.g. "due_tomorrow:<loan id>:0"
    loan_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("loans.id", ondelete="CASCADE"), index=True)
    recipient: Mapped[str] = mapped_column(String(255))
