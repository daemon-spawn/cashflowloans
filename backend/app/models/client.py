from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Model

if TYPE_CHECKING:
    from app.models import Application, Document, Loan, Note


class Client(Model):
    """A person. One row per SA ID number, so repeat applicants reuse their record."""

    __tablename__ = "clients"

    first_name: Mapped[str] = mapped_column(String(100))
    last_name: Mapped[str] = mapped_column(String(100))
    id_number: Mapped[str] = mapped_column(String(13), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(255), index=True)
    phone: Mapped[str] = mapped_column(String(20))

    applications: Mapped[list[Application]] = relationship(
        back_populates="client", order_by="Application.created_at.desc()"
    )
    loans: Mapped[list[Loan]] = relationship(back_populates="client", order_by="Loan.created_at.desc()")
    documents: Mapped[list[Document]] = relationship(back_populates="client")
    notes: Mapped[list[Note]] = relationship(back_populates="client", order_by="Note.created_at.desc()")

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}".strip()
