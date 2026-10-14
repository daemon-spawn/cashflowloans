"""Request bodies for CRM endpoints."""

from datetime import date
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.enums import (
    ApplicationSource,
    ApplicationStatus,
    CollateralStatus,
    DocumentKind,
    MessageStatus,
)
from app.schemas.application import ApplicationIn
from app.schemas.common import SaPhone


class _In(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="ignore", populate_by_name=True)


class StatusIn(_In):
    status: ApplicationStatus
    decline_reason: str | None = Field(default=None, alias="declineReason", max_length=1000)
    override: bool = False


class StaffApplicationIn(ApplicationIn):
    """An application taken by phone, WhatsApp, email or in person. Documents can follow later."""

    source: ApplicationSource = ApplicationSource.PHONE


class PayoutIn(_In):
    paid_out_on: date | None = Field(default=None, alias="paidOutOn")
    due_date: date | None = Field(default=None, alias="dueDate")


class PaymentIn(_In):
    amount: Decimal = Field(gt=0, max_digits=12, decimal_places=2)
    paid_on: date | None = Field(default=None, alias="paidOn")
    method: str = "eft"
    reference: str | None = Field(default=None, max_length=100)
    notes: str | None = Field(default=None, max_length=1000)


class WriteOffIn(_In):
    reason: str = Field(min_length=1, max_length=1000)


class CollateralIn(_In):
    status: CollateralStatus | None = None
    description: str | None = Field(default=None, max_length=2000)


class ClientUpdateIn(_In):
    first_name: str | None = Field(default=None, alias="firstName", min_length=1, max_length=100)
    last_name: str | None = Field(default=None, alias="lastName", min_length=1, max_length=100)
    email: EmailStr | None = None
    phone: SaPhone | None = None


class BlacklistIn(_In):
    blacklisted: bool
    reason: str | None = Field(default=None, max_length=1000)


class NoteIn(_In):
    body: str = Field(min_length=1, max_length=5000)
    application_id: str | None = Field(default=None, alias="applicationId")
    loan_id: str | None = Field(default=None, alias="loanId")


class MessageStatusIn(_In):
    status: MessageStatus


class DocumentKindIn(_In):
    kind: DocumentKind = DocumentKind.OTHER
    application_id: str | None = Field(default=None, alias="applicationId")
