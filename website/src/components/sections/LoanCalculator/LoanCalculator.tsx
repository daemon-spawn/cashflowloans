"use client";

import { useState } from "react";
import Link from "next/link";
import { calculateRepayment, formatRand, loanRules, minAmountFor, type LoanType } from "@cashflow/core";
import { Button } from "@cashflow/ui/components/button";
import { cn } from "@cashflow/ui/lib/utils";

import styles from "./LoanCalculator.module.css";

export function LoanCalculator({ className }: { className?: string }) {
  const [type, setType] = useState<LoanType>("unsecured");
  const [amount, setAmount] = useState(2000);

  const min = minAmountFor(type);
  const value = Math.max(amount, min);
  const { fee, total } = calculateRepayment(value);

  return (
    <div className={cn("bg-card rounded-2xl border p-6 shadow-sm sm:p-8", className)}>
      <div role="radiogroup" aria-label="Loan type" className="bg-muted grid grid-cols-2 gap-1 rounded-lg p-1">
        {(["unsecured", "secured"] as const).map((t) => (
          <button
            key={t}
            role="radio"
            aria-checked={type === t}
            onClick={() => setType(t)}
            className={cn("rounded-md py-2 text-sm font-medium capitalize", type === t && "bg-background shadow-sm")}
          >
            {t}
          </button>
        ))}
      </div>

      <label htmlFor="loan-amount" className="mt-8 block text-sm font-medium">How much do you need?</label>
      <p className="text-brand-900 mt-1 text-4xl font-semibold tabular-nums">{formatRand(value)}</p>
      <input
        id="loan-amount"
        type="range"
        min={min}
        max={loanRules.maxAmount}
        step={100}
        value={value}
        onChange={(e) => setAmount(Number(e.target.value))}
        className={styles.range}
      />
      <div className="text-muted-foreground flex justify-between text-xs">
        <span>{formatRand(min)}</span>
        <span>{formatRand(loanRules.maxAmount)}</span>
      </div>

      <dl className="mt-8 grid grid-cols-3 gap-4 text-sm">
        <div><dt className="text-muted-foreground">Term</dt><dd className="font-medium">{loanRules.termMonths} month</dd></div>
        <div><dt className="text-muted-foreground">Fee ({loanRules.feeRate * 100}%)</dt><dd className="font-medium tabular-nums">{formatRand(fee)}</dd></div>
        <div><dt className="text-muted-foreground">You repay</dt><dd className="font-semibold tabular-nums">{formatRand(total)}</dd></div>
      </dl>
      <p className="text-muted-foreground mt-4 text-xs">
        Late payment adds a further {loanRules.lateRate * 100}% to the outstanding balance for each missed due date.
      </p>

      <Button asChild size="lg" className="mt-6 w-full">
        <Link href={`/apply?type=${type}&amount=${value}`}>Apply for {formatRand(value)}</Link>
      </Button>
    </div>
  );
}
