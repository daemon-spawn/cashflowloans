"use client";

import { useState } from "react";
import Link from "next/link";
import { calculateRepayment, formatRand, loanRules, minAmountFor, type LoanType } from "@cashflow/core";
import { Button } from "@cashflow/ui/components/button";
import { cn } from "@cashflow/ui/lib/utils";

import { AnimatedNumber } from "@/components/motion/AnimatedNumber";
import styles from "./LoanCalculator.module.css";

const TYPES: { value: LoanType; label: string; hint: string }[] = [
  { value: "unsecured", label: "Unsecured", hint: "Payslip, no collateral" },
  { value: "secured", label: "Secured", hint: `From ${formatRand(loanRules.securedMinAmount)}, against an asset` },
];

type Props = {
  className?: string;
  /** Show the apply button. Off on /apply, where the form sits next to it. */
  showCta?: boolean;
  defaultType?: LoanType;
  defaultAmount?: number;
  /** "card" stacks everything; "bar" lays the controls out in one row on large screens. */
  layout?: "card" | "bar";
};

export function LoanCalculator({ className, showCta = true, defaultType = "unsecured", defaultAmount = 2000, layout = "card" }: Props) {
  const [type, setType] = useState<LoanType>(defaultType);
  const [amount, setAmount] = useState(defaultAmount);

  const min = minAmountFor(type);
  const value = Math.min(Math.max(amount, min), loanRules.maxAmount);
  const { fee, total } = calculateRepayment(value);
  const fill = ((value - min) / (loanRules.maxAmount - min)) * 100;
  const bar = layout === "bar";

  return (
    <div
      className={cn(
        "bg-card text-ink rounded-2xl p-6 shadow-[0_24px_60px_-24px_rgb(13_42_33/0.45)] sm:p-7",
        bar && "lg:grid lg:grid-cols-[18rem_minmax(0,1fr)_18rem] lg:items-center lg:gap-x-10 lg:gap-y-5 lg:p-8",
        className,
      )}
    >
      <fieldset>
        <legend className="t-meta text-muted-foreground">Loan type</legend>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {TYPES.map((t) => (
            <label
              key={t.value}
              className={cn(
                "has-focus-visible:outline-[var(--focus)] cursor-pointer rounded-lg border px-3 py-2.5 transition-colors has-focus-visible:outline-3 has-focus-visible:outline-offset-2",
                type === t.value ? "border-brand-900 bg-sage" : "border-border hover:border-input",
              )}
            >
              <input type="radio" name="calc-type" value={t.value} checked={type === t.value} onChange={() => setType(t.value)} className="sr-only" />
              <span className="block font-semibold">{t.label}</span>
              <span className="text-muted-foreground block text-xs">{t.hint}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={cn(bar && "lg:border-border lg:border-x lg:px-10")}>
      <div className={cn("mt-7 flex items-baseline justify-between gap-4", bar && "lg:mt-0")}>
        <label htmlFor="calc-amount" className="font-medium">I need</label>
        <output htmlFor="calc-amount" className="font-display t-num text-3xl font-bold tracking-tight">
          {formatRand(value)}
        </output>
      </div>
      <input
        id="calc-amount"
        type="range"
        min={min}
        max={loanRules.maxAmount}
        step={100}
        value={value}
        onChange={(e) => setAmount(Number(e.target.value))}
        className={styles.range}
        style={{ "--fill": `${fill}%` } as React.CSSProperties}
        aria-valuetext={formatRand(value)}
      />
      <div className="text-muted-foreground t-num flex justify-between text-xs">
        <span>{formatRand(min)}</span>
        <span>{formatRand(loanRules.maxAmount)}</span>
      </div>
      </div>

      <div>

      <dl className={cn("border-border mt-6 grid gap-2 border-t pt-5 text-[0.9375rem]", bar && "lg:mt-0 lg:border-0 lg:pt-0")}>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Loan amount</dt>
          <dd className="t-num">{formatRand(value)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Fee ({loanRules.feeRate * 100}%, {loanRules.termMonths} month)</dt>
          <dd className="t-num">{formatRand(fee)}</dd>
        </div>
        <div className="bg-gold/20 -mx-3 mt-2 flex items-baseline justify-between gap-4 rounded-lg px-3 py-3">
          <dt className="font-semibold">You repay</dt>
          <dd className="font-display t-num text-2xl font-bold">
            <AnimatedNumber value={total} format={formatRand} />
          </dd>
        </div>
      </dl>
      <p className={cn("text-muted-foreground mt-3 text-xs leading-relaxed", bar && "lg:sr-only")}>
        One payment within {loanRules.termMonths} month. A missed due date adds {loanRules.lateRate * 100}% to the outstanding balance.
      </p>

      {showCta && (
        <Button asChild size="lg" className="mt-5 w-full">
          <Link href={`/apply?type=${type}&amount=${value}`}>Apply for {formatRand(value)}</Link>
        </Button>
      )}
      </div>
      {bar && (
        <p className="text-muted-foreground hidden text-xs lg:col-span-3 lg:block">
          One payment within {loanRules.termMonths} month. A missed due date adds {loanRules.lateRate * 100}% to the outstanding balance.
        </p>
      )}
    </div>
  );
}
