"use client";

import { useState, useTransition } from "react";
import { Mail, Send } from "lucide-react";
import { Button } from "@cashflow/ui/components/button";

import { FormMessage } from "@/components/shared/FormMessage";
import type { ActionState } from "@/lib/action-state";
import { runReminders, sendTestEmail } from "@/lib/actions";
import type { ReminderRun } from "@/lib/types";

export function NotificationControls() {
  const [testState, setTestState] = useState<ActionState>({});
  const [run, setRun] = useState<ActionState & { result?: ReminderRun }>({});
  const [pending, startTransition] = useTransition();

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" disabled={pending} onClick={() => startTransition(async () => setTestState(await sendTestEmail()))}>
            <Mail className="size-4" aria-hidden /> Send test email
          </Button>
          <Button disabled={pending} onClick={() => startTransition(async () => setRun(await runReminders()))}>
            <Send className="size-4" aria-hidden /> Run today&apos;s reminders now
          </Button>
        </div>
        <p className="text-muted-foreground text-xs">
          Running the reminders now is safe: anything already sent today is skipped, and the 09:00 run won&apos;t send it again.
        </p>
      </div>
      <FormMessage state={testState} />
      {run.error && <FormMessage state={run} />}
      {run.result && (
        <dl role="status" className="bg-muted grid grid-cols-2 gap-x-6 gap-y-2 rounded-lg p-4 text-sm sm:grid-cols-4">
          {(
            [
              ["Loans checked", run.result.loansChecked],
              ["Reminders sent", run.result.remindersSent],
              ["Due tomorrow", run.result.dueTomorrow],
              ["Due today", run.result.dueToday],
              ["Overdue", run.result.overdue],
              ["Awaiting payout", run.result.pendingPayout],
              ["To review", run.result.toReview],
              ["Owner summary", run.result.digestSent ? "Sent" : "Not sent"],
            ] as const
          ).map(([label, value]) => (
            <div key={label}>
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="font-semibold tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
