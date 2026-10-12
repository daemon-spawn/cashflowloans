/**
 * Loan product rules. The backend (backend/app/core/loan_rules.py) is the
 * authority — these mirror it so the calculator and CRM show the same numbers.
 */
export const LOAN_TYPES = ["secured", "unsecured"] as const;
export type LoanType = (typeof LOAN_TYPES)[number];

export const loanRules = {
  /** Overall range across both products (used in headlines). */
  minAmount: 100,
  maxAmount: 100_000,
  /** Unsecured loans (payslip + DebiCheck): R100 to R10,000. */
  unsecuredMaxAmount: 10_000,
  /** Secured loans (collateral collected by courier): R500 to R100,000. */
  securedMinAmount: 500,
  securedMaxAmount: 100_000,
  termMonths: 1,
  /** Flat fee on the principal for the 1-month term. */
  feeRate: 0.5,
  /** Applied to the outstanding balance each time a due date is missed. */
  lateRate: 0.5,
} as const;

const round2 = (n: number) => Math.round(n * 100) / 100;

export function calculateRepayment(principal: number) {
  const fee = round2(principal * loanRules.feeRate);
  return { principal, fee, total: round2(principal + fee) };
}

/** Balance after `missedPeriods` missed due dates on an outstanding amount. */
export function balanceAfterMissedPeriods(outstanding: number, missedPeriods: number) {
  return round2(outstanding * (1 + loanRules.lateRate) ** Math.max(0, missedPeriods));
}

export function minAmountFor(type: LoanType) {
  return type === "secured" ? loanRules.securedMinAmount : loanRules.minAmount;
}

export function maxAmountFor(type: LoanType) {
  return type === "secured" ? loanRules.securedMaxAmount : loanRules.unsecuredMaxAmount;
}
