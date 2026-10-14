"use client";

import { useActionState, useEffect, useRef } from "react";
import { Textarea } from "@cashflow/ui/components/textarea";

import { Panel } from "@/components/shared/Panel";
import { FormMessage } from "@/components/shared/FormMessage";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { idle } from "@/lib/action-state";
import { addNote } from "@/lib/actions";
import { dateTime } from "@/lib/format";
import type { Note } from "@/lib/types";

export function NotesPanel({
  clientId,
  applicationId,
  loanId,
  notes,
}: {
  clientId: string;
  applicationId?: string;
  loanId?: string;
  notes: Note[];
}) {
  const [state, action] = useActionState(addNote, idle);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) form.current?.reset();
  }, [state]);

  return (
    <Panel title="Notes">
      <form ref={form} action={action} className="grid gap-2">
        <input type="hidden" name="clientId" value={clientId} />
        {applicationId && <input type="hidden" name="applicationId" value={applicationId} />}
        {loanId && <input type="hidden" name="loanId" value={loanId} />}
        <label htmlFor="note-body" className="sr-only">
          New note
        </label>
        <Textarea id="note-body" name="body" rows={2} placeholder="Add a note for the team" required />
        <div className="flex items-center justify-between gap-3">
          <FormMessage state={state.ok ? {} : state} />
          <SubmitButton size="sm" className="ml-auto" pendingLabel="Adding…">
            Add note
          </SubmitButton>
        </div>
      </form>
      {notes.length > 0 && (
        <ul className="mt-5 grid gap-4 border-t pt-4">
          {notes.map((n) => (
            <li key={n.id}>
              <p className="text-sm whitespace-pre-wrap">{n.body}</p>
              <p className="text-muted-foreground mt-1 text-xs">
                {n.author} · {dateTime(n.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
