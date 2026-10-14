import Link from "next/link";
import { cn } from "@cashflow/ui/lib/utils";

import { ContactLinks } from "@/components/shared/ContactLinks";
import { dueLabel, rand } from "@/lib/format";
import type { LoanRow } from "@/lib/types";

/** Who to contact today, with one-tap call and WhatsApp. */
export function FollowUpList({ rows, today, empty }: { rows: LoanRow[]; today: string; empty: string }) {
  if (rows.length === 0) return <p className="text-muted-foreground text-sm">{empty}</p>;
  return (
    <ul className="divide-y">
      {rows.map((r) => (
        <li key={r.loanId} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
          <div className="min-w-0">
            <Link href={`/loans/${r.loanId}`} className="font-medium hover:underline">
              {r.clientName}
            </Link>
            <p className={cn("text-xs", r.status === "overdue" ? "text-destructive" : "text-muted-foreground")}>
              {rand(r.balance)} · {dueLabel(today, r.dueDate)} · {r.reference}
            </p>
          </div>
          <ContactLinks
            phone={r.phone}
            message={`Hi ${r.clientName.split(" ")[0]}, this is Cashflow Loans about loan ${r.reference}: ${rand(r.balance)} is ${r.status === "overdue" ? "overdue" : "due soon"}.`}
          />
        </li>
      ))}
    </ul>
  );
}
