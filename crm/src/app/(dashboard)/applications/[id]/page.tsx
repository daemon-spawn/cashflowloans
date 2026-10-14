import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { calculateRepayment } from "@cashflow/core";

import { ApplicationActions } from "@/components/applications/ApplicationActions";
import { LoanTable } from "@/components/loans/LoanTable";
import { PayoutDialog } from "@/components/loans/PayoutDialog";
import { ActivityList } from "@/components/records/ActivityList";
import { DocumentsPanel } from "@/components/records/DocumentsPanel";
import { NotesPanel } from "@/components/records/NotesPanel";
import { BackLink } from "@/components/shared/BackLink";
import { ContactLinks } from "@/components/shared/ContactLinks";
import { DetailList } from "@/components/shared/DetailList";
import { PageTitle } from "@/components/shared/PageTitle";
import { Panel } from "@/components/shared/Panel";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ApiError, api } from "@/lib/api";
import { dateTime, humanize, rand, shortDate, todaySast } from "@/lib/format";
import type { ApplicationDetail } from "@/lib/types";

export const metadata: Metadata = { title: "Application" };

const REQUIRED: Record<string, string[]> = {
  unsecured: ["id_document", "payslip", "bank_statement"],
  secured: ["id_document", "collateral_image"],
};
const docLabel: Record<string, string> = {
  id_document: "ID",
  payslip: "payslip",
  bank_statement: "bank statement",
  collateral_image: "collateral photos",
};

async function getApplication(id: string) {
  try {
    return await api<ApplicationDetail>(`/applications/${id}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }
}

export default async function ApplicationPage({ params }: PageProps<"/applications/[id]">) {
  const app = await getApplication((await params).id);
  const today = todaySast();
  const repay = calculateRepayment(Number(app.amount));
  const missing = REQUIRED[app.loanType].filter((k) => !app.documents.some((d) => d.kind === k));
  const unpaid = app.otherLoans.filter((l) => ["active", "due", "overdue"].includes(l.status));

  return (
    <>
      <BackLink href="/applications">Applications</BackLink>
      <PageTitle
        title={app.client.fullName}
        badges={
          <>
            <StatusBadge status={app.status} />
            {app.client.blacklisted && <StatusBadge status="blacklisted" />}
          </>
        }
        description={`${app.reference} · received ${dateTime(app.createdAt)} via ${humanize(app.source).toLowerCase()}`}
        actions={<ApplicationActions app={app} loanPaidOut={Boolean(app.loan?.paidOutOn)} />}
      />

      {(app.client.blacklisted || unpaid.length > 0 || missing.length > 0) && (
        <div className="mb-5 grid gap-2">
          {app.client.blacklisted && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
              <strong>Blacklisted.</strong> {app.client.blacklistReason}
            </p>
          )}
          {unpaid.length > 0 && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              <strong>Already borrowing:</strong> {unpaid.length} open loan{unpaid.length > 1 ? "s" : ""} with{" "}
              {rand(unpaid.reduce((s, l) => s + Number(l.balance), 0))} outstanding.
            </p>
          )}
          {missing.length > 0 && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              <strong>Missing documents:</strong> {missing.map((k) => docLabel[k]).join(", ")}.
            </p>
          )}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid min-w-0 content-start gap-5">
          <Panel title="Loan request">
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                ["Amount", rand(app.amount)],
                ["Fee (50%)", rand(repay.fee)],
                ["To repay", rand(repay.total)],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-muted-foreground text-sm">{label}</p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
                </div>
              ))}
            </div>
            <DetailList
              className="mt-6 border-t pt-5"
              items={[
                ["Loan type", <span key="t" className="capitalize">{app.loanType}</span>],
                ["Wants to repay on", shortDate(app.repaymentDate)],
                ["Reviewed by", app.reviewedBy ?? "—"],
                ...(app.declineReason ? ([["Decline reason", app.declineReason]] as [string, string][]) : []),
              ]}
            />
          </Panel>

          {app.loan && (
            <Panel
              title="Loan"
              actions={
                <>
                  {app.loan.status === "pending_payout" && <PayoutDialog loan={app.loan} today={today} size="sm" />}
                  <Link href={`/loans/${app.loan.id}`} className="text-brand-900 inline-flex h-8 items-center text-sm font-medium hover:underline">
                    Open loan
                  </Link>
                </>
              }
            >
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <StatusBadge status={app.loan.status} />
                {app.loan.status === "pending_payout"
                  ? "Approved. Mark it as paid out once the money has been sent."
                  : `${rand(app.loan.balance)} owed · due ${shortDate(app.loan.dueDate)}`}
              </div>
            </Panel>
          )}

          <DocumentsPanel documents={app.documents} uploadPath={`/applications/${app.id}/documents`} />

          {app.otherLoans.length > 0 && (
            <Panel title="Borrowing history" description="Earlier loans for this client." bodyClassName="p-0 sm:p-2">
              <div className="px-5 py-3 sm:px-3">
                <LoanTable items={app.otherLoans} today={today} showClient={false} />
              </div>
            </Panel>
          )}
        </div>

        <div className="grid content-start gap-5">
          <Panel title="Applicant" actions={<Link href={`/clients/${app.client.id}`} className="text-brand-900 text-sm font-medium hover:underline">Profile</Link>}>
            <DetailList
              items={[
                ["ID number", app.client.idNumber],
                ["Phone", app.client.phone],
                ["Email", app.client.email],
              ]}
            />
            <ContactLinks className="mt-4" phone={app.client.phone} email={app.client.email} />
          </Panel>
          <NotesPanel clientId={app.client.id} applicationId={app.id} notes={app.notes} />
          <ActivityList items={app.activity} />
        </div>
      </div>
    </>
  );
}
