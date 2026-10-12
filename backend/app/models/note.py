from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Model

if TYPE_CHECKING:
    from app.models import Client


class Note(Model):
    __tablename__ = "notes"

    client_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("clients.id", ondelete="CASCADE"), index=True)
    application_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("applications.id"))
    body: Mapped[str] = mapped_column(Text)
    author_email: Mapped[str] = mapped_column(String(255))

    client: Mapped[Client] = relationship(back_populates="notes")
