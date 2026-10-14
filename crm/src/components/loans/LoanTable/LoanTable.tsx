import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@cashflow/ui/components/table";
import { cn } from "@cashflow/ui/lib/utils";

import { StatusBadge } from "@/components/shared/StatusBadge";
import { dueLabel, rand, shortDate } from "@/lib/format";
import type { Loan } from "@/lib/types";

export function LoanTable({ items, today, showClient = true }: { items: Loan[]; today: string; showClient?: boolean }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {showClient && <TableHead>Client</TableHead>}
          <TableHead>Reference</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Principal</TableHead>
          <TableHead className="text-right">Balance</TableHead>
          <TableHead>Due</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((l) => {
          const open = ["active", "due", "overdue"].includes(l.status);
          return (
            <TableRow key={l.id} className="relative">
              {showClient && (
                <TableCell>
                  <Link href={`/loans/${l.id}`} className="font-medium after:absolute after:inset-0 hover:underline">
                    {l.client.fullName}
                  </Link>
                  <span className="text-muted-foreground block text-xs">{l.client.phone}</span>
                </TableCell>
              )}
              <TableCell className="text-muted-foreground">
                {showClient ? (
                  l.reference
                ) : (
                  <Link href={`/loans/${l.id}`} className="text-foreground font-medium after:absolute after:inset-0 hover:underline">
                    {l.reference}
                  </Link>
                )}
              </TableCell>
              <TableCell className="capitalize">{l.loanType}</TableCell>
              <TableCell className="text-right tabular-nums">{rand(l.principal)}</TableCell>
              <TableCell className={cn("text-right font-medium tabular-nums", l.status === "overdue" && "text-destructive")}>
                {l.status === "pending_payout" ? "—" : rand(l.balance)}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {l.dueDate ? shortDate(l.dueDate) : "—"}
                {open && l.dueDate && <span className={cn("block text-xs", l.status === "overdue" ? "text-destructive" : "text-muted-foreground")}>{dueLabel(today, l.dueDate)}</span>}
              </TableCell>
              <TableCell>
                <StatusBadge status={l.status} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
