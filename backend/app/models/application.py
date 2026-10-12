from __future__ import annotations

import uuid
from datetime import date, datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import Date, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Model, Money, enum_column
from app.models.enums import ApplicationStatus, LoanType

if TYPE_CHECKING:
    from app.models import Client, Document, Loan


class Application(Model):
    """A loan request. Becomes a Loan only once approved and paid out."""

    __tablename__ = "applications"

    reference: Mapped[str] = mapped_column(String(16), unique=True, index=True)
    client_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("clients.id", ondelete="CASCADE"), index=True)
    loan_type: Mapped[LoanType] = mapped_column(enum_column(LoanType))
    amount: Mapped[Decimal] = mapped_column(Money)
    requested_repayment_date: Mapped[date] = mapped_column(Date)
    status: Mapped[ApplicationStatus] = mapped_column(
        enum_column(ApplicationStatus), default=ApplicationStatus.NEW, index=True
    )
    decline_reason: Mapped[str | None] = mapped_column(Text)
    source: Mapped[str] = mapped_column(String(20), default="website")
    accepted_terms_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    reviewed_by: Mapped[str | None] = mapped_column(String(255))

    client: Mapped[Client] = relationship(back_populates="applications")
    documents: Mapped[list[Document]] = relationship(back_populates="application")
    loan: Mapped[Loan | None] = relationship(back_populates="application")
