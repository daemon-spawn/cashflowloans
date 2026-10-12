/**
 * Loan product rules. The backend (backend/app/core/loan_rules.py) is the
 * authority — these mirror it so the calculator and CRM show the same numbers.
 */
export const LOAN_TYPES = ["secured", "unsecured"] as const;
export type LoanType = (typeof LOAN_TYPES)[number];

export const loanRules = {
  minAmount: 100,
  maxAmount: 100_000,
  /** Secured loans (collateral collected by courier) start at this amount. */
  securedMinAmount: 500,
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
