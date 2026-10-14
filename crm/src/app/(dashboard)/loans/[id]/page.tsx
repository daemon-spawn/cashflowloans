import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@cashflow/ui/lib/utils";

import { CollateralForm } from "@/components/loans/CollateralForm";
import { LedgerTable } from "@/components/loans/LedgerTable";
import { PaymentDialog } from "@/components/loans/PaymentDialog";
import { PaymentsTable } from "@/components/loans/PaymentsTable";
import { PayoutDialog } from "@/components/loans/PayoutDialog";
import { WriteOffDialog } from "@/components/loans/WriteOffDialog";
import { ActivityList } from "@/components/records/ActivityList";
import { NotesPanel } from "@/components/records/NotesPanel";
import { BackLink } from "@/components/shared/BackLink";
import { ContactLinks } from "@/components/shared/ContactLinks";
import { DetailList } from "@/components/shared/DetailList";
import { PageTitle } from "@/components/shared/PageTitle";
import { Panel } from "@/components/shared/Panel";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ApiError, api } from "@/lib/api";
import { dueLabel, humanize, rand, shortDate, todaySast } from "@/lib/format";
import type { LoanDetail } from "@/lib/types";

export const metadata: Metadata = { title: "Loan" };

async function getLoan(id: string) {
  try {
    return await api<LoanDetail>(`/loans/${id}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }
}

export default async function LoanPage({ params }: PageProps<"/loans/[id]">) {
  const loan = await getLoan((await params).id);
  const today = todaySast();
  const isOpen = ["active", "due", "overdue"].includes(loan.status);
  const overdue = loan.status === "overdue";
  const reminder = `Hi ${loan.client.firstName}, this is Cashflow Loans. Your balance for loan ${loan.reference} is ${rand(loan.balance)}${loan.dueDate ? `, due ${shortDate(loan.dueDate)}` : ""}.`;

  return (
    <>
      <BackLink href="/loans">Loans</BackLink>
      <PageTitle
        title={loan.client.fullName}
        badges={
          <>
            <StatusBadge status={loan.status} />
            {loan.client.blacklisted && <StatusBadge status="blacklisted" />}
          </>
        }
        description={
          <>
            Loan {loan.reference} · <span className="capitalize">{loan.loanType}</span> ·{" "}
            <Link href={`/clients/${loan.client.id}`} className="text-brand-900 hover:underline">
              Client profile
            </Link>
            {loan.applicationId && (
              <>
                {" · "}
                <Link href={`/applications/${loan.applicationId}`} className="text-brand-900 hover:underline">
                  Application
                </Link>
              </>
            )}
          </>
        }
        actions={
          <>
            {loan.status === "pending_payout" && <PayoutDialog loan={loan} today={today} />}
            {isOpen && <PaymentDialog loan={loan} today={today} />}
            {isOpen && <WriteOffDialog loan={loan} />}
          </>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid min-w-0 content-start gap-5">
          {/* The number that matters most, big. */}
          <section
            data-surface={overdue ? undefined : "dark"}
            className={cn("grid grid-cols-3 gap-x-4 gap-y-5 rounded-xl border p-5 sm:grid-cols-[1.3fr_1fr_1fr_1fr] sm:gap-6 sm:p-6", overdue ? "border-red-200 bg-red-50" : "bg-brand-950 border-brand-950 text-white")}
          >
            <div className="col-span-3 sm:col-span-1">
              <p className={cn("text-sm", overdue ? "text-red-900" : "text-white/70")}>
                {loan.status === "pending_payout" ? "To pay out" : loan.status === "paid" ? "Settled" : "Owed today"}
              </p>
              <p className="mt-1 text-4xl font-semibold tracking-tight tabular-nums">
                {loan.status === "pending_payout" ? rand(loan.principal) : rand(loan.balance)}
              </p>
              {isOpen && loan.dueDate && (
                <p className={cn("mt-1 text-sm", overdue ? "font-medium text-red-900" : "text-white/70")}>
                  {overdue && loan.nextDueDate
                    ? `${dueLabel(today, loan.dueDate)} · +50% again after ${shortDate(loan.nextDueDate)}`
                    : `${dueLabel(today, loan.dueDate)} · ${shortDate(loan.dueDate)}`}
                </p>
              )}
            </div>
            {[
              ["Repayable", rand(loan.totalRepayable)],
              ["Paid", rand(loan.paid)],
              ["Late charges", rand(loan.lateCharges)],
            ].map(([label, value]) => (
              <div key={label}>
                <p className={cn("text-sm", overdue ? "text-red-900/80" : "text-white/70")}>{label}</p>
                <p className="mt-1 text-lg font-semibold tabular-nums sm:text-xl">{value}</p>
              </div>
            ))}
          </section>

          {loan.status === "pending_payout" && (
            <p className="bg-card rounded-xl border border-dashed p-5 text-sm">
              Approved and waiting for payout. Once the money is sent, use <strong>Mark as paid out</strong>: the term and the due date start then.
            </p>
          )}
          {loan.writtenOffAt && (
            <p className="bg-muted rounded-xl border p-5 text-sm">
              Written off on {shortDate(loan.writtenOffAt)}: {loan.writtenOffReason}
            </p>
          )}

          <Panel title="Payments" bodyClassName="p-0 sm:p-2">
            <div className="px-5 py-3 sm:px-3">
              <PaymentsTable loanId={loan.id} payments={loan.payments} canEdit={!loan.writtenOffAt} />
            </div>
          </Panel>

          {loan.ledger.entries.length > 0 && (
            <Panel title="Statement" description="Every charge and payment, in date order." bodyClassName="p-0 sm:p-2">
              <div className="px-5 py-3 sm:px-3">
                <LedgerTable entries={loan.ledger.entries} />
              </div>
            </Panel>
          )}
        </div>

        <div className="grid content-start gap-5">
          <Panel title="Borrower">
            <DetailList
              items={[
                ["Phone", loan.client.phone],
                ["Email", loan.client.email],
                ["ID number", loan.client.idNumber],
              ]}
            />
            <ContactLinks className="mt-4" phone={loan.client.phone} email={loan.client.email} message={isOpen ? reminder : undefined} />
          </Panel>
          <Panel title="Loan details">
            <DetailList
              items={[
                ["Principal", rand(loan.principal)],
                ["Fee (50%)", rand(loan.fee)],
                ["Paid out", loan.paidOutOn ? `${shortDate(loan.paidOutOn)}${loan.paidOutBy ? ` by ${loan.paidOutBy}` : ""}` : "Not yet"],
                ["Due date", shortDate(loan.dueDate)],
                ["Missed due dates", String(loan.missedPeriods)],
                ["Type", humanize(loan.loanType)],
              ]}
            />
          </Panel>
          {loan.loanType === "secured" && <CollateralForm loan={loan} />}
          <NotesPanel clientId={loan.client.id} loanId={loan.id} notes={loan.notes} />
          <ActivityList items={loan.activity} />
        </div>
      </div>
    </>
  );
}
