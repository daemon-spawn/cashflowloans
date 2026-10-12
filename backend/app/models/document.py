from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Model, enum_column
from app.models.enums import DocumentKind

if TYPE_CHECKING:
    from app.models import Application, Client


class Document(Model):
    """Metadata for a file stored in the private Supabase Storage bucket."""

    __tablename__ = "documents"

    client_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("clients.id", ondelete="CASCADE"), index=True)
    application_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("applications.id"), index=True)
    kind: Mapped[DocumentKind] = mapped_column(enum_column(DocumentKind))
    storage_path: Mapped[str] = mapped_column(String(500), unique=True)
    original_filename: Mapped[str] = mapped_column(String(255))
    content_type: Mapped[str] = mapped_column(String(100))
    size_bytes: Mapped[int] = mapped_column(Integer)

    client: Mapped[Client] = relationship(back_populates="documents")
    application: Mapped[Application | None] = relationship(back_populates="documents")
