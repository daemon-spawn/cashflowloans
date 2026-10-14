import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@cashflow/ui/components/table";
import { cn } from "@cashflow/ui/lib/utils";

import { rand, shortDate } from "@/lib/format";
import type { LedgerEntry } from "@/lib/types";

/** Statement view: how the balance got to where it is. The same lines the API uses for every figure. */
export function LedgerTable({ entries }: { entries: LedgerEntry[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Item</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Balance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.map((e, i) => {
          const amount = Number(e.amount);
          return (
            <TableRow key={i}>
              <TableCell className="whitespace-nowrap">{shortDate(e.on)}</TableCell>
              <TableCell className={cn("min-w-40", e.kind === "late_charge" && "text-destructive")}>{e.label}</TableCell>
              <TableCell className={cn("text-right tabular-nums", amount < 0 && "text-brand-900")}>
                {amount < 0 ? `−${rand(-amount)}` : `+${rand(amount)}`}
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums">{rand(e.balance)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
