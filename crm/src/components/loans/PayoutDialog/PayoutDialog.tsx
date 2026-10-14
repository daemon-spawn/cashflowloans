"use client";

import { useState } from "react";
import { Banknote } from "lucide-react";
import { Button } from "@cashflow/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@cashflow/ui/components/dialog";
import { Input } from "@cashflow/ui/components/input";
import { Label } from "@cashflow/ui/components/label";

import { FieldError, FormMessage } from "@/components/shared/FormMessage";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { payOut } from "@/lib/actions";
import { rand, shortDate } from "@/lib/format";
import type { Loan } from "@/lib/types";
import { useDialogAction } from "@/lib/use-dialog-action";

/** Mirrors default_due_date in backend/app/services/loans.py. */
function defaultDueDate(paidOutOn: string, requested: string | null) {
  const [y, m, d] = paidOutOn.split("-").map(Number);
  const lastOfNext = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const termEnd = new Date(Date.UTC(y, m, Math.min(d, lastOfNext))).toISOString().slice(0, 10);
  return requested && requested > paidOutOn && requested < termEnd ? requested : termEnd;
}

export function PayoutDialog({ loan, today, size = "default" }: { loan: Loan; today: string; size?: "default" | "sm" }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={size}>
          <Banknote className="size-4" aria-hidden /> Mark as paid out
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark {rand(loan.principal)} as paid out</DialogTitle>
          <DialogDescription>
            Do this once the money has left the bank. The one-month term starts on the payout date and {loan.client.firstName} gets
            an email with the amount to repay and the due date.
          </DialogDescription>
        </DialogHeader>
        <PayoutForm loan={loan} today={today} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function PayoutForm({ loan, today, onDone }: { loan: Loan; today: string; onDone: () => void }) {
  const [state, action] = useDialogAction(payOut, onDone);
  const [paidOutOn, setPaidOutOn] = useState(today);
  const [dueDate, setDueDate] = useState(() => defaultDueDate(today, loan.requestedRepaymentDate));
  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="loanId" value={loan.id} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="paidOutOn">Paid out on</Label>
          <Input
            id="paidOutOn"
            name="paidOutOn"
            type="date"
            max={today}
            value={paidOutOn}
            onChange={(e) => {
              setPaidOutOn(e.target.value);
              if (e.target.value) setDueDate(defaultDueDate(e.target.value, loan.requestedRepaymentDate));
            }}
            required
          />
          <FieldError state={state} name="paidOutOn" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="dueDate">Due date</Label>
          <Input id="dueDate" name="dueDate" type="date" min={paidOutOn} value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
          <FieldError state={state} name="dueDate" />
        </div>
      </div>
      <p className="bg-muted rounded-lg px-3 py-2 text-sm">
        To repay: <strong className="tabular-nums">{rand(loan.totalRepayable)}</strong> ({rand(loan.principal)} + {rand(loan.fee)} fee).
        {loan.requestedRepaymentDate && <> The applicant asked to repay on {shortDate(loan.requestedRepaymentDate)}.</>}
      </p>
      <FormMessage state={state} />
      <DialogFooter>
        <SubmitButton>Confirm payout</SubmitButton>
      </DialogFooter>
    </form>
  );
}
