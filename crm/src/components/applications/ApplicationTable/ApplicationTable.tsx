import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@cashflow/ui/components/table";

import { StatusBadge } from "@/components/shared/StatusBadge";
import { humanize, rand, shortDate } from "@/lib/format";
import type { Application } from "@/lib/types";

export function ApplicationTable({ items, framed = true }: { items: Application[]; framed?: boolean }) {
  return (
    <div className={framed ? "bg-card rounded-xl border" : undefined}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Applicant</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Received</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((a) => (
            <TableRow key={a.id} className="relative">
              <TableCell>
                <Link href={`/applications/${a.id}`} className="font-medium after:absolute after:inset-0 hover:underline">
                  {a.client.fullName}
                </Link>
                <span className="text-muted-foreground block text-xs">{a.client.phone}</span>
              </TableCell>
              <TableCell className="text-muted-foreground">{a.reference}</TableCell>
              <TableCell className="capitalize">{a.loanType}</TableCell>
              <TableCell className="text-right font-medium tabular-nums">{rand(a.amount)}</TableCell>
              <TableCell>{humanize(a.source)}</TableCell>
              <TableCell className="whitespace-nowrap">{shortDate(a.createdAt)}</TableCell>
              <TableCell>
                <StatusBadge status={a.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
