/**
 * Pipeline vocabulary. An application is the request; a loan exists only once
 * an application is approved and paid out. Mirrors backend/app/models/enums.py.
 */
export const APPLICATION_STATUSES = ["new", "in_review", "approved", "declined"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const LOAN_STATUSES = ["pending_payout", "active", "due", "overdue", "paid", "written_off"] as const;
export type LoanStatus = (typeof LOAN_STATUSES)[number];

export const DOCUMENT_KINDS = ["id_document", "payslip", "bank_statement", "collateral_image", "other"] as const;
export type DocumentKind = (typeof DOCUMENT_KINDS)[number];

export const COLLATERAL_STATUSES = ["awaiting_collection", "held", "returned", "sold"] as const;
export type CollateralStatus = (typeof COLLATERAL_STATUSES)[number];

export const APPLICATION_SOURCES = ["website", "whatsapp", "phone", "email", "walk_in"] as const;
export type ApplicationSource = (typeof APPLICATION_SOURCES)[number];

export const PAYMENT_METHODS = ["eft", "debicheck", "cash"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
