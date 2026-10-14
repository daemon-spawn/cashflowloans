"""Status vocabularies. Mirrors packages/core/src/status.ts."""

import enum


class LoanType(enum.StrEnum):
    SECURED = "secured"
    UNSECURED = "unsecured"


class ApplicationStatus(enum.StrEnum):
    NEW = "new"
    IN_REVIEW = "in_review"
    APPROVED = "approved"
    DECLINED = "declined"


class LoanStatus(enum.StrEnum):
    """Derived from the ledger by app.core.ledger.loan_status; stored for filtering."""

    PENDING_PAYOUT = "pending_payout"  # approved, money not yet sent
    ACTIVE = "active"
    DUE = "due"
    OVERDUE = "overdue"
    PAID = "paid"
    WRITTEN_OFF = "written_off"


class CollateralStatus(enum.StrEnum):
    AWAITING_COLLECTION = "awaiting_collection"
    HELD = "held"
    RETURNED = "returned"
    SOLD = "sold"


class ApplicationSource(enum.StrEnum):
    WEBSITE = "website"
    WHATSAPP = "whatsapp"
    PHONE = "phone"
    EMAIL = "email"
    WALK_IN = "walk_in"


class DocumentKind(enum.StrEnum):
    ID_DOCUMENT = "id_document"
    PAYSLIP = "payslip"
    BANK_STATEMENT = "bank_statement"
    COLLATERAL_IMAGE = "collateral_image"
    OTHER = "other"


class MessageStatus(enum.StrEnum):
    NEW = "new"
    HANDLED = "handled"
