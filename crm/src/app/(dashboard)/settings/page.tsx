import type { Metadata } from "next";

import { NotificationControls } from "@/components/settings/NotificationControls";
import { DetailList } from "@/components/shared/DetailList";
import { PageTitle } from "@/components/shared/PageTitle";
import { Panel } from "@/components/shared/Panel";
import { api } from "@/lib/api";
import type { Settings } from "@/lib/types";

export const metadata: Metadata = { title: "Settings" };

const schedule = [
  ["Repayment due tomorrow", "Reminder email to the borrower"],
  ["Repayment due today", "Reminder email to the borrower"],
  ["Each missed due date", "Overdue email with the new balance and the next date 50% is added"],
  ["Every morning", "Summary to the owner: overdue, due, awaiting payout and applications to review"],
] as const;

export default async function SettingsPage() {
  const s = await api<Settings>("/settings");
  return (
    <>
      <PageTitle title="Settings" description="Who can sign in, and the emails the system sends." />
      <div className="grid max-w-4xl gap-5">
        <Panel title="Staff access" description="Only these emails can use the CRM. Changing the list is done on the API (STAFF_EMAILS on Render).">
          <ul className="grid gap-2 text-sm">
            {s.staffEmails.map((e) => (
              <li key={e} className="flex items-center gap-2">
                {e}
                {e === s.you && <span className="bg-sage text-brand-900 rounded-full px-2 py-0.5 text-xs">You</span>}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Email">
          <DetailList
            items={[
              ["Owner notifications go to", s.notifyEmail],
              ["Email sending", s.emailConfigured ? "Set up" : "Not set up yet: add the SMTP settings on Render"],
              ["Daily run", "09:00 South African time"],
            ]}
          />
          <ul className="mt-5 grid gap-2 border-t pt-4 text-sm">
            {schedule.map(([when, what]) => (
              <li key={when} className="grid gap-1 sm:grid-cols-[14rem_1fr]">
                <span className="font-medium">{when}</span>
                <span className="text-muted-foreground">{what}</span>
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground mt-4 text-sm">
            Borrowers also get an email when their application is approved or declined, when the loan is paid out, and when it&apos;s paid in full.
          </p>
        </Panel>
        <Panel title="Run now">
          <NotificationControls />
        </Panel>
      </div>
    </>
  );
}
