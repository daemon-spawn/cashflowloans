"use client";

import { useState, useTransition } from "react";
import { Check, RotateCcw } from "lucide-react";
import { Button } from "@cashflow/ui/components/button";

import { ContactLinks } from "@/components/shared/ContactLinks";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { setMessageStatus } from "@/lib/actions";
import { dateTime } from "@/lib/format";
import type { Message } from "@/lib/types";

export function MessageList({ items }: { items: Message[] }) {
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const toggle = (m: Message) =>
    startTransition(async () => {
      const res = await setMessageStatus(m.id, m.status === "new" ? "handled" : "new");
      setError(res.ok ? undefined : res.error);
    });

  return (
    <div className="grid gap-3">
      {error && <p role="alert" className="text-destructive text-sm">{error}</p>}
      {items.map((m) => (
        <article key={m.id} className="bg-card rounded-xl border p-5">
          <header className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold">{m.name}</h2>
                <StatusBadge status={m.status} />
              </div>
              <p className="text-muted-foreground text-sm">
                {m.email}
                {m.phone && <> · {m.phone}</>} · {dateTime(m.createdAt)}
              </p>
            </div>
            <Button variant={m.status === "new" ? "default" : "outline"} size="sm" disabled={pending} onClick={() => toggle(m)}>
              {m.status === "new" ? <Check className="size-4" aria-hidden /> : <RotateCcw className="size-4" aria-hidden />}
              {m.status === "new" ? "Mark handled" : "Mark as new"}
            </Button>
          </header>
          {m.subject && <p className="mt-3 font-medium">{m.subject}</p>}
          <p className="mt-2 text-sm whitespace-pre-wrap">{m.message}</p>
          {m.phone ? (
            <ContactLinks className="mt-4" phone={m.phone} email={m.email} />
          ) : (
            <a className="text-brand-900 mt-4 inline-block text-sm font-medium hover:underline" href={`mailto:${m.email}?subject=${encodeURIComponent(m.subject ?? "Your message to Cashflow Loans")}`}>
              Reply by email
            </a>
          )}
        </article>
      ))}
    </div>
  );
}
