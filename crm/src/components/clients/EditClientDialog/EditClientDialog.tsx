"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@cashflow/ui/components/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@cashflow/ui/components/dialog";
import { Input } from "@cashflow/ui/components/input";
import { Label } from "@cashflow/ui/components/label";

import { FieldError, FormMessage } from "@/components/shared/FormMessage";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { updateClient } from "@/lib/actions";
import type { Client } from "@/lib/types";
import { useDialogAction } from "@/lib/use-dialog-action";

export function EditClientDialog({ client }: { client: Client }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="size-3.5" aria-hidden /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Edit contact details</DialogTitle>
        </DialogHeader>
        <EditForm client={client} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function EditForm({ client, onDone }: { client: Client; onDone: () => void }) {
  const [state, action] = useDialogAction(updateClient, onDone);
  const fields = [
    ["firstName", "First name", client.firstName, "text"],
    ["lastName", "Surname", client.lastName, "text"],
    ["phone", "Cellphone", client.phone, "tel"],
    ["email", "Email", client.email, "email"],
  ] as const;
  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="clientId" value={client.id} />
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(([name, label, value, type]) => (
          <div key={name} className="grid gap-2">
            <Label htmlFor={`edit-${name}`}>{label}</Label>
            <Input id={`edit-${name}`} name={name} type={type} defaultValue={value} required />
            <FieldError state={state} name={name} />
          </div>
        ))}
      </div>
      <p className="text-muted-foreground text-xs">The ID number can&apos;t change: it identifies the client.</p>
      <FormMessage state={state} />
      <DialogFooter>
        <SubmitButton>Save</SubmitButton>
      </DialogFooter>
    </form>
  );
}
