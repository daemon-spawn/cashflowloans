import Link from "next/link";
import type { LoanStatus } from "@cashflow/core";

const order: { status: LoanStatus; label: string }[] = [
  { status: "pending_payout", label: "Awaiting payout" },
  { status: "active", label: "Active" },
  { status: "due", label: "Due" },
  { status: "overdue", label: "Overdue" },
  { status: "paid", label: "Paid" },
  { status: "written_off", label: "Written off" },
];

/**
 * Loans by status. One series, one hue, horizontal bars: magnitude comparison.
 * Each row links to the filtered loan list; the value sits at the bar tip.
 */
export function StatusBars({ counts }: { counts: Partial<Record<LoanStatus, number>> }) {
  const max = Math.max(1, ...order.map((o) => counts[o.status] ?? 0));
  return (
    <figure>
      <ul className="grid gap-2.5" aria-label="Loans by status">
        {order.map(({ status, label }) => {
          const n = counts[status] ?? 0;
          return (
            <li key={status}>
              <Link
                href={`/loans?status=${status}`}
                title={`${label}: ${n} loan${n === 1 ? "" : "s"}`}
                className="group hover:bg-muted -mx-2 grid grid-cols-[7.5rem_1fr] items-center gap-3 rounded-md px-2 py-1"
              >
                <span className="text-muted-foreground text-sm">{label}</span>
                <span className="flex items-center gap-2">
                  {n > 0 && (
                    <span
                      aria-hidden
                      className="bg-brand-900 group-hover:bg-brand-700 block h-4 rounded-r-[4px] transition-colors"
                      style={{ width: `${(n / max) * 85}%` }}
                    />
                  )}
                  <span className="text-sm font-medium tabular-nums">{n}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
