import type { Metadata } from "next";
import { LOAN_STATUSES } from "@cashflow/core";

import { LoanTable } from "@/components/loans/LoanTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageTitle } from "@/components/shared/PageTitle";
import { SearchBox } from "@/components/shared/SearchBox";
import { Tabs } from "@/components/shared/Tabs";
import { api } from "@/lib/api";
import { rand, todaySast } from "@/lib/format";
import type { Loan } from "@/lib/types";

export const metadata: Metadata = { title: "Loans" };

const tabLabels: Record<string, string> = {
  open: "Open",
  pending_payout: "Awaiting payout",
  active: "Active",
  due: "Due",
  overdue: "Overdue",
  paid: "Paid",
  written_off: "Written off",
  all: "All",
};
const OPEN = new Set(["active", "due", "overdue"]);

export default async function LoansPage({ searchParams }: PageProps<"/loans">) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const status = typeof params.status === "string" && params.status in tabLabels ? params.status : "open";

  const { items } = await api<{ items: Loan[] }>(`/loans${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  const counts: Record<string, number> = { all: items.length, open: items.filter((l) => OPEN.has(l.status)).length };
  for (const s of LOAN_STATUSES) counts[s] = items.filter((l) => l.status === s).length;
  const shown = items.filter((l) => (status === "all" ? true : status === "open" ? OPEN.has(l.status) : l.status === status));
  const outstanding = shown.filter((l) => OPEN.has(l.status)).reduce((sum, l) => sum + Number(l.balance), 0);

  const href = (value: string) => `/loans?status=${value}${q ? `&q=${encodeURIComponent(q)}` : ""}`;
  return (
    <>
      <PageTitle
        title="Loans"
        description={
          <>
            Balances include the 50% fee and any late charges. {outstanding > 0 && <strong className="text-foreground">{rand(outstanding)} outstanding in this view.</strong>}
          </>
        }
      />
      <div className="mb-4">
        <SearchBox defaultValue={q} placeholder="Search name, ID, phone or reference" hidden={{ status }} />
      </div>
      <Tabs
        active={status}
        items={["open", "pending_payout", "overdue", "due", "active", "paid", "written_off", "all"].map((v) => ({
          label: tabLabels[v],
          value: v,
          href: href(v),
          count: counts[v] ?? 0,
        }))}
      />
      {shown.length === 0 ? (
        <EmptyState title="No loans here" description={q ? `Nothing matches “${q}”.` : "Approved applications appear here, ready to pay out."} />
      ) : (
        <div className="bg-card rounded-xl border">
          <LoanTable items={shown} today={todaySast()} />
        </div>
      )}
    </>
  );
}
