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
    ACTIVE = "active"
    DUE = "due"
    OVERDUE = "overdue"
    PAID = "paid"
    WRITTEN_OFF = "written_off"


class DocumentKind(enum.StrEnum):
    ID_DOCUMENT = "id_document"
    PAYSLIP = "payslip"
    BANK_STATEMENT = "bank_statement"
    COLLATERAL_IMAGE = "collateral_image"
    OTHER = "other"


class MessageStatus(enum.StrEnum):
    NEW = "new"
    HANDLED = "handled"
