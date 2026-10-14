import type { Metadata } from "next";
import Link from "next/link";

import { FollowUpList } from "@/components/overview/FollowUpList";
import { StatusBars } from "@/components/overview/StatusBars";
import { PageTitle } from "@/components/shared/PageTitle";
import { Panel } from "@/components/shared/Panel";
import { Stat } from "@/components/shared/Stat";
import { api } from "@/lib/api";
import { rand, shortDate } from "@/lib/format";
import type { Overview } from "@/lib/types";

export const metadata: Metadata = { title: "Overview" };

const percent = (v: number | null) => (v === null ? "—" : `${Math.round(v * 100)}%`);

export default async function OverviewPage() {
  const o = await api<Overview>("/reports/overview");
  const t = o.totals;
  const toReview = o.applications.new + o.applications.inReview;

  return (
    <>
      <PageTitle title="Overview" description={`Today, ${shortDate(o.today)}`} />

      {/* What needs doing, first. */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Stat
          tone="dark"
          label="Outstanding"
          value={rand(t.outstanding)}
          hint={`${t.openLoans} open loan${t.openLoans === 1 ? "" : "s"}, including fees and late charges`}
          href="/loans"
        />
        <Stat
          label="Overdue"
          value={rand(t.overdueAmount)}
          tone={t.overdueLoans ? "alert" : "default"}
          hint={`${t.overdueLoans} loan${t.overdueLoans === 1 ? "" : "s"}`}
          href="/loans?status=overdue"
        />
        <Stat
          label="Applications to review"
          value={toReview}
          hint={`${o.applications.today} received today`}
          href="/applications"
        />
        <Stat
          label="Awaiting payout"
          value={t.pendingPayout}
          hint={t.pendingPayout ? `${rand(t.pendingPayoutAmount)} to send` : "Nothing waiting"}
          href="/loans?status=pending_payout"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Overdue" description="Contact these clients first." actions={<Link href="/loans?status=overdue" className="text-brand-900 text-sm font-medium hover:underline">All overdue</Link>}>
          <FollowUpList rows={o.overdue} today={o.today} empty="No overdue loans." />
        </Panel>
        <Panel title="Due in the next 7 days" description="Borrowers get an email the day before and on the day.">
          <FollowUpList rows={o.dueSoon} today={o.today} empty="Nothing due this week." />
        </Panel>

        <Panel title="Money in and out" description="Across every loan paid out so far.">
          <dl className="grid gap-5 sm:grid-cols-3">
            {[
              ["Paid out", rand(t.loaned)],
              ["Collected", rand(t.collected)],
              ["Average loan", rand(t.averageLoan)],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-muted-foreground text-sm">{label}</dt>
                <dd className="mt-1 text-xl font-semibold tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 border-t pt-5">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-muted-foreground">Repayment rate</span>
              <span className="font-semibold tabular-nums">{percent(t.repaymentRate)}</span>
            </div>
            {/* Meter: collected as a share of everything charged (principal, fees and late charges). */}
            <div
              role="meter"
              aria-label="Repayment rate"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={t.repaymentRate === null ? 0 : Math.round(t.repaymentRate * 100)}
              className="bg-sage mt-2 h-2.5 overflow-hidden rounded-full"
            >
              <div className="bg-brand-900 h-full rounded-full" style={{ width: `${Math.min(100, (t.repaymentRate ?? 0) * 100)}%` }} />
            </div>
            <p className="text-muted-foreground mt-2 text-xs">Collected as a share of everything charged: principal, fees and late charges. Written-off loans are left out.</p>
          </div>
          <dl className="mt-5 grid gap-5 border-t pt-5 sm:grid-cols-2">
            {([["unsecured", "Unsecured outstanding"], ["secured", "Secured outstanding"]] as const).map(([type, label]) => (
              <div key={type}>
                <dt className="text-muted-foreground text-sm">{label}</dt>
                <dd className="mt-1 text-lg font-semibold tabular-nums">{rand(o.outstandingByType[type] ?? 0)}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel title="Loans by status" description={`${t.clients} client${t.clients === 1 ? "" : "s"} in total`}>
          <StatusBars counts={o.loansByStatus} />
        </Panel>
      </div>
      {o.messagesNew > 0 && (
        <p className="text-muted-foreground mt-5 text-sm">
          <Link href="/messages" className="text-brand-900 font-medium hover:underline">
            {o.messagesNew} new message{o.messagesNew === 1 ? "" : "s"}
          </Link>{" "}
          from the website.
        </p>
      )}
    </>
  );
}
