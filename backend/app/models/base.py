import uuid
from datetime import UTC, datetime
from decimal import Decimal

from sqlalchemy import DateTime, Enum, Numeric, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.extensions import db


def utcnow() -> datetime:
    return datetime.now(UTC)


Money = Numeric(12, 2, asdecimal=True)


def enum_column(enum_cls):
    """Store enums as plain strings with a CHECK constraint — easy to migrate."""
    return Enum(enum_cls, native_enum=False, values_callable=lambda e: [m.value for m in e], length=32)


class Model(db.Model):
    __abstract__ = True

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)


__all__ = ["Model", "Money", "Decimal", "enum_column", "utcnow"]
