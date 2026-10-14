import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@cashflow/ui/components/table";

import { StatusBadge } from "@/components/shared/StatusBadge";
import { rand, shortDate } from "@/lib/format";
import type { ClientSummary } from "@/lib/types";

const initials = (c: ClientSummary) => `${c.firstName[0] ?? ""}${c.lastName[0] ?? ""}`.toUpperCase();

export function ClientTable({ items }: { items: ClientSummary[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>ID number</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Standing</TableHead>
          <TableHead className="text-right">Borrowed</TableHead>
          <TableHead className="text-right">Repaid</TableHead>
          <TableHead className="text-right">Outstanding</TableHead>
          <TableHead>Next due</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((c) => (
          <TableRow key={c.id} className="relative">
            <TableCell>
              <div className="flex items-center gap-3">
                <span aria-hidden className="bg-sage text-brand-900 grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold">
                  {initials(c)}
                </span>
                <div className="min-w-0">
                  <Link href={`/clients/${c.id}`} className="font-medium after:absolute after:inset-0 hover:underline">
                    {c.fullName}
                  </Link>
                  <span className="text-muted-foreground block truncate text-xs">{c.email}</span>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground tabular-nums">{c.idNumber}</TableCell>
            <TableCell className="whitespace-nowrap">{c.phone}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                <StatusBadge status={c.standing} />
                {c.blacklisted && <StatusBadge status="blacklisted" />}
              </div>
            </TableCell>
            <TableCell className="text-right tabular-nums">{rand(c.borrowed)}</TableCell>
            <TableCell className="text-right tabular-nums">{rand(c.repaid)}</TableCell>
            <TableCell className="text-right font-medium tabular-nums">{Number(c.outstanding) > 0 ? rand(c.outstanding) : "—"}</TableCell>
            <TableCell className="whitespace-nowrap">{shortDate(c.nextDueDate)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
