"use client";

import { useState } from "react";
import { Button } from "@cashflow/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@cashflow/ui/components/dialog";
import { Label } from "@cashflow/ui/components/label";
import { Textarea } from "@cashflow/ui/components/textarea";

import { FormMessage } from "@/components/shared/FormMessage";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { writeOff } from "@/lib/actions";
import { rand } from "@/lib/format";
import type { Loan } from "@/lib/types";
import { useDialogAction } from "@/lib/use-dialog-action";

export function WriteOffDialog({ loan }: { loan: Loan }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Write off</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Write off this loan?</DialogTitle>
          <DialogDescription>
            {rand(loan.balance)} is outstanding. Writing off stops late charges and reminders, and can&apos;t be undone from the CRM.
          </DialogDescription>
        </DialogHeader>
        <WriteOffForm loan={loan} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function WriteOffForm({ loan, onDone }: { loan: Loan; onDone: () => void }) {
  const [state, action] = useDialogAction(writeOff, onDone);
  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="loanId" value={loan.id} />
      <div className="grid gap-2">
        <Label htmlFor="reason">Reason</Label>
        <Textarea id="reason" name="reason" rows={3} required placeholder="e.g. Unreachable for 3 months, handed to debt collection" />
      </div>
      <FormMessage state={state} />
      <DialogFooter>
        <SubmitButton variant="destructive">Write off {rand(loan.balance)}</SubmitButton>
      </DialogFooter>
    </form>
  );
}
