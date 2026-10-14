"use client";

import { useState } from "react";
import { Button } from "@cashflow/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@cashflow/ui/components/dialog";
import { Label } from "@cashflow/ui/components/label";
import { Textarea } from "@cashflow/ui/components/textarea";

import { FormMessage } from "@/components/shared/FormMessage";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { setBlacklist } from "@/lib/actions";
import type { Client } from "@/lib/types";
import { useDialogAction } from "@/lib/use-dialog-action";

/** Terms 2.1. A blacklisted client can still apply, but approving them needs a deliberate override. */
export function BlacklistDialog({ client }: { client: Client }) {
  const [open, setOpen] = useState(false);
  const adding = !client.blacklisted;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={adding ? "text-destructive" : undefined}>
          {adding ? "Blacklist" : "Remove from blacklist"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{adding ? `Blacklist ${client.fullName}?` : `Remove ${client.fullName} from the blacklist?`}</DialogTitle>
          <DialogDescription>
            {adding
              ? "Their future applications are flagged and can only be approved with an override. This is the CRM flag only; reporting to credit bureaus is done separately."
              : "Their applications will no longer be flagged."}
          </DialogDescription>
        </DialogHeader>
        <BlacklistForm client={client} adding={adding} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function BlacklistForm({ client, adding, onDone }: { client: Client; adding: boolean; onDone: () => void }) {
  const [state, action] = useDialogAction(setBlacklist, onDone);
  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="clientId" value={client.id} />
      <input type="hidden" name="blacklisted" value={adding ? "true" : "false"} />
      {adding && (
        <div className="grid gap-2">
          <Label htmlFor="blacklist-reason">Reason</Label>
          <Textarea id="blacklist-reason" name="reason" rows={3} required placeholder="e.g. Defaulted on CFL-7LLQCE, unreachable since March" />
        </div>
      )}
      <FormMessage state={state} />
      <DialogFooter>
        <SubmitButton variant={adding ? "destructive" : "default"}>{adding ? "Blacklist" : "Remove"}</SubmitButton>
      </DialogFooter>
    </form>
  );
}
