from __future__ import annotations

import uuid
from datetime import date, datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core import loan_rules
from app.models.base import Model, Money, enum_column
from app.models.enums import CollateralStatus, LoanStatus, LoanType

if TYPE_CHECKING:
    from app.models import Application, Client, Payment


class Loan(Model):
    """Created automatically when an application is approved; the term starts at payout."""

    __tablename__ = "loans"

    client_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("clients.id", ondelete="CASCADE"), index=True)
    application_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("applications.id"), unique=True)
    loan_type: Mapped[LoanType] = mapped_column(enum_column(LoanType))
    principal: Mapped[Decimal] = mapped_column(Money)
    fee: Mapped[Decimal] = mapped_column(Money)
    # Both set when staff mark the loan as paid out.
    disbursed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    due_date: Mapped[date | None] = mapped_column(Date, index=True)
    status: Mapped[LoanStatus] = mapped_column(
        enum_column(LoanStatus), default=LoanStatus.PENDING_PAYOUT, index=True
    )
    paid_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    written_off_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    written_off_reason: Mapped[str | None] = mapped_column(Text)
    paid_out_by: Mapped[str | None] = mapped_column(Text)

    # Secured loans only.
    collateral_description: Mapped[str | None] = mapped_column(Text)
    collateral_status: Mapped[CollateralStatus | None] = mapped_column(enum_column(CollateralStatus))

    client: Mapped[Client] = relationship(back_populates="loans")
    application: Mapped[Application | None] = relationship(back_populates="loan")
    payments: Mapped[list[Payment]] = relationship(
        back_populates="loan", order_by="Payment.paid_on", cascade="all, delete-orphan"
    )

    @property
    def total_repayable(self) -> Decimal:
        """Principal plus the fee for the term, before any late charges."""
        return loan_rules.money(self.principal + self.fee)

    @property
    def amount_paid(self) -> Decimal:
        return loan_rules.money(sum((p.amount for p in self.payments), Decimal(0)))
