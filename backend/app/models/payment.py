from __future__ import annotations

import uuid
from datetime import date
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import Date, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Model, Money

if TYPE_CHECKING:
    from app.models import Loan


class Payment(Model):
    __tablename__ = "payments"

    loan_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("loans.id", ondelete="CASCADE"), index=True)
    amount: Mapped[Decimal] = mapped_column(Money)
    paid_on: Mapped[date] = mapped_column(Date)
    method: Mapped[str] = mapped_column(String(30), default="eft")  # eft, debicheck, cash
    reference: Mapped[str | None] = mapped_column(String(100))
    recorded_by: Mapped[str | None] = mapped_column(String(255))

    loan: Mapped[Loan] = relationship(back_populates="payments")
