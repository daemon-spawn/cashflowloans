/**
 * Pipeline vocabulary. An application is the request; a loan exists only once
 * an application is approved and paid out. Mirrors backend/app/models/enums.py.
 */
export const APPLICATION_STATUSES = ["new", "in_review", "approved", "declined"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const LOAN_STATUSES = ["active", "due", "overdue", "paid", "written_off"] as const;
export type LoanStatus = (typeof LOAN_STATUSES)[number];

export const DOCUMENT_KINDS = ["id_document", "payslip", "bank_statement", "collateral_image", "other"] as const;
export type DocumentKind = (typeof DOCUMENT_KINDS)[number];
