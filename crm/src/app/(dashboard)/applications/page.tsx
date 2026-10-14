import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { APPLICATION_STATUSES } from "@cashflow/core";
import { Button } from "@cashflow/ui/components/button";

import { ApplicationTable } from "@/components/applications/ApplicationTable";
import { PipelineBoard } from "@/components/applications/PipelineBoard";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageTitle } from "@/components/shared/PageTitle";
import { SearchBox } from "@/components/shared/SearchBox";
import { Tabs } from "@/components/shared/Tabs";
import { api } from "@/lib/api";
import { humanize } from "@/lib/format";
import type { Application } from "@/lib/types";

export const metadata: Metadata = { title: "Applications" };

export default async function ApplicationsPage({ searchParams }: PageProps<"/applications">) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const status = typeof params.status === "string" ? params.status : undefined;
  const view = params.view === "list" || q ? "list" : "board";

  const query = new URLSearchParams({ ...(q && { q }), ...(view === "list" && status && { status }) });
  const { items } = await api<{ items: Application[] }>(`/applications?${query}`);

  return (
    <>
      <PageTitle
        title="Applications"
        description="Website applications arrive here as New. Phone and WhatsApp applications can be added by hand."
        actions={
          <Button asChild>
            <Link href="/applications/new">
              <Plus className="size-4" aria-hidden /> New application
            </Link>
          </Button>
        }
      />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <SearchBox defaultValue={q} placeholder="Search name, ID, phone or reference" hidden={{ view: "list" }} />
        <div className="bg-card inline-flex rounded-full border p-1 text-sm">
          <Link href="/applications" aria-current={view === "board" ? "page" : undefined} className={`rounded-full px-4 py-1.5 ${view === "board" ? "bg-brand-900 text-white" : ""}`}>
            Board
          </Link>
          <Link href="/applications?view=list" aria-current={view === "list" ? "page" : undefined} className={`rounded-full px-4 py-1.5 ${view === "list" ? "bg-brand-900 text-white" : ""}`}>
            List
          </Link>
        </div>
      </div>

      {view === "board" ? (
        <PipelineBoard applications={items} />
      ) : (
        <>
          <Tabs
            active={status ?? "all"}
            items={[
              { label: "All", value: "all", href: `/applications?view=list${q ? `&q=${encodeURIComponent(q)}` : ""}` },
              ...APPLICATION_STATUSES.map((s) => ({
                label: humanize(s),
                value: s,
                href: `/applications?view=list&status=${s}${q ? `&q=${encodeURIComponent(q)}` : ""}`,
              })),
            ]}
          />
          {items.length === 0 ? <EmptyState title="No applications found" description={q ? `Nothing matches “${q}”.` : undefined} /> : <ApplicationTable items={items} />}
        </>
      )}
    </>
  );
}
