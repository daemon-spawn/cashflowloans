"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@cashflow/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@cashflow/ui/components/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@cashflow/ui/components/table";

import { deletePayment } from "@/lib/actions";
import { rand, shortDate } from "@/lib/format";
import type { Payment } from "@/lib/types";

const methodLabel: Record<string, string> = { eft: "EFT", debicheck: "DebiCheck", cash: "Cash" };

export function PaymentsTable({ loanId, payments, canEdit }: { loanId: string; payments: Payment[]; canEdit: boolean }) {
  const [removing, setRemoving] = useState<Payment | null>(null);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  if (payments.length === 0) return <p className="text-muted-foreground text-sm">No payments yet.</p>;
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Recorded by</TableHead>
            {canEdit && <TableHead className="w-10"><span className="sr-only">Remove</span></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="whitespace-nowrap">{shortDate(p.paidOn)}</TableCell>
              <TableCell className="text-right font-medium tabular-nums">{rand(p.amount)}</TableCell>
              <TableCell>{methodLabel[p.method] ?? p.method}</TableCell>
              <TableCell className="text-muted-foreground">
                {p.reference ?? "—"}
                {p.notes && <span className="block text-xs">{p.notes}</span>}
              </TableCell>
              <TableCell className="text-muted-foreground text-xs">{p.recordedBy}</TableCell>
              {canEdit && (
                <TableCell>
                  <Button variant="ghost" size="icon" aria-label={`Remove payment of ${rand(p.amount)}`} onClick={() => setRemoving(p)}>
                    <Trash2 className="size-4" aria-hidden />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={removing !== null} onOpenChange={(o) => !o && setRemoving(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove this payment?</DialogTitle>
            <DialogDescription>
              {removing && `${rand(removing.amount)} on ${shortDate(removing.paidOn)}. `}Use this to fix a mistake. The balance is recalculated
              and the history keeps a record.
            </DialogDescription>
          </DialogHeader>
          {error && <p role="alert" className="text-destructive text-sm">{error}</p>}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRemoving(null)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  if (!removing) return;
                  const res = await deletePayment(loanId, removing.id);
                  if (res.ok) setRemoving(null);
                  else setError(res.error);
                })
              }
            >
              {pending ? "Removing…" : "Remove payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
