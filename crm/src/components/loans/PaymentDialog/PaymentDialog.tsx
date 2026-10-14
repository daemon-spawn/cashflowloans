"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { PAYMENT_METHODS } from "@cashflow/core";
import { Button } from "@cashflow/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@cashflow/ui/components/dialog";
import { Input } from "@cashflow/ui/components/input";
import { Label } from "@cashflow/ui/components/label";
import { Select } from "@cashflow/ui/components/select";

import { FieldError, FormMessage } from "@/components/shared/FormMessage";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { recordPayment } from "@/lib/actions";
import { rand } from "@/lib/format";
import type { Loan } from "@/lib/types";
import { useDialogAction } from "@/lib/use-dialog-action";

const methodLabel: Record<string, string> = { eft: "EFT / bank transfer", debicheck: "DebiCheck debit order", cash: "Cash" };

export function PaymentDialog({ loan, today }: { loan: Loan; today: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" aria-hidden /> Record payment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record a payment</DialogTitle>
          <DialogDescription>
            {loan.client.fullName} owes <strong>{rand(loan.balance)}</strong> today.
          </DialogDescription>
        </DialogHeader>
        <PaymentForm loan={loan} today={today} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function PaymentForm({ loan, today, onDone }: { loan: Loan; today: string; onDone: () => void }) {
  const [state, action] = useDialogAction(recordPayment, onDone);
  const amount = useRef<HTMLInputElement>(null);
  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="loanId" value={loan.id} />
      <div className="grid gap-2">
        <div className="flex items-end justify-between gap-2">
          <Label htmlFor="amount">Amount (R)</Label>
          <button
            type="button"
            className="text-brand-900 text-xs font-medium underline-offset-2 hover:underline"
            onClick={() => {
              if (amount.current) amount.current.value = Number(loan.balance).toFixed(2);
            }}
          >
            Pay off {rand(loan.balance)}
          </button>
        </div>
        <Input ref={amount} id="amount" name="amount" type="number" inputMode="decimal" min="0.01" step="0.01" required />
        <FieldError state={state} name="amount" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="paidOn">Paid on</Label>
          <Input id="paidOn" name="paidOn" type="date" defaultValue={today} min={loan.paidOutOn ?? undefined} max={today} required />
          <FieldError state={state} name="paidOn" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="method">Method</Label>
          <Select id="method" name="method" defaultValue={loan.loanType === "unsecured" ? "debicheck" : "eft"}>
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>
                {methodLabel[m]}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="reference">Bank reference (optional)</Label>
        <Input id="reference" name="reference" maxLength={100} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="payment-notes">Notes (optional)</Label>
        <Input id="payment-notes" name="notes" maxLength={1000} />
      </div>
      <p className="text-muted-foreground text-xs">A payment made on or before a due date counts before that date&apos;s late charge.</p>
      <FormMessage state={state} />
      <DialogFooter>
        <SubmitButton>Save payment</SubmitButton>
      </DialogFooter>
    </form>
  );
}
