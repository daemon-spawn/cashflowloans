from __future__ import annotations

import uuid
from datetime import date, datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import Date, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core import loan_rules
from app.models.base import Model, Money, enum_column
from app.models.enums import LoanStatus, LoanType

if TYPE_CHECKING:
    from app.models import Application, Client, Payment


class Loan(Model):
    __tablename__ = "loans"

    client_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("clients.id", ondelete="CASCADE"), index=True)
    application_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("applications.id"), unique=True)
    loan_type: Mapped[LoanType] = mapped_column(enum_column(LoanType))
    principal: Mapped[Decimal] = mapped_column(Money)
    fee: Mapped[Decimal] = mapped_column(Money)
    disbursed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    due_date: Mapped[date] = mapped_column(Date, index=True)
    status: Mapped[LoanStatus] = mapped_column(enum_column(LoanStatus), default=LoanStatus.ACTIVE, index=True)

    client: Mapped[Client] = relationship(back_populates="loans")
    application: Mapped[Application | None] = relationship(back_populates="loan")
    payments: Mapped[list[Payment]] = relationship(back_populates="loan", order_by="Payment.paid_on")

    @property
    def total_repayable(self) -> Decimal:
        return loan_rules.money(self.principal + self.fee)

    @property
    def amount_paid(self) -> Decimal:
        return loan_rules.money(sum((p.amount for p in self.payments), Decimal(0)))
