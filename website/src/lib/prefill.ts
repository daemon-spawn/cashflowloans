import type { LoanType } from "@cashflow/core";

/** Reads `?type=` and `?amount=` as sent by the calculator's "apply" link. */
export function parsePrefill(type: string | null | undefined, amount: string | null | undefined) {
  const n = Number(amount);
  return {
    type: (type === "secured" ? "secured" : "unsecured") as LoanType,
    amount: Number.isFinite(n) && n > 0 ? Math.round(n) : undefined,
  };
}
