import type { Metadata } from "next";
import { Download } from "lucide-react";
import { Button } from "@cashflow/ui/components/button";
import { Select } from "@cashflow/ui/components/select";

import { ClientTable } from "@/components/clients/ClientTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageTitle } from "@/components/shared/PageTitle";
import { SearchBox } from "@/components/shared/SearchBox";
import { api } from "@/lib/api";
import { apiPath, clientQuery, SORTS, sortClients, STANDING_LABELS } from "@/lib/clients";
import type { ClientSummary } from "@/lib/types";

export const metadata: Metadata = { title: "Clients" };

export default async function ClientsPage({ searchParams }: PageProps<"/clients">) {
  const query = clientQuery(await searchParams);
  const { items } = await api<{ items: ClientSummary[] }>(apiPath(query));
  const sorted = sortClients(items, query.sort);
  const exportParams = new URLSearchParams(
    Object.entries({ q: query.q, standing: query.standing, sort: query.sort, blacklisted: query.blacklisted ? "true" : undefined }).filter(
      (e): e is [string, string] => Boolean(e[1]),
    ),
  );

  return (
    <>
      <PageTitle
        title="Clients"
        description="One record per SA ID number, so repeat borrowers keep their history."
        actions={
          <Button asChild variant="outline">
            <a href={`/clients/export?${exportParams}`}>
              <Download className="size-4" aria-hidden /> Export CSV
            </a>
          </Button>
        }
      />
      {/* GET forms: the URL always reflects the view, so it can be bookmarked or exported. */}
      <div className="mb-4">
        <SearchBox defaultValue={query.q} placeholder="Search name, ID, phone or email" hidden={{ standing: query.standing, sort: query.sort }} />
      </div>
      <form className="mb-5 flex flex-wrap items-center gap-3 text-sm">
        {query.q && <input type="hidden" name="q" value={query.q} />}
        <label className="flex items-center gap-2">
          <span className="text-muted-foreground">Standing</span>
          <Select name="standing" defaultValue={query.standing ?? ""} className="w-44">
            <option value="">All</option>
            {Object.entries(STANDING_LABELS).map(([v, label]) => (
              <option key={v} value={v}>
                {label}
              </option>
            ))}
          </Select>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-muted-foreground">Sort</span>
          <Select name="sort" defaultValue={query.sort} className="w-44">
            {Object.entries(SORTS).map(([v, label]) => (
              <option key={v} value={v}>
                {label}
              </option>
            ))}
          </Select>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="blacklisted" value="true" defaultChecked={query.blacklisted} />
          Blacklisted only
        </label>
        <Button type="submit" variant="outline" size="sm">
          Apply
        </Button>
        <span className="text-muted-foreground ml-auto">
          {sorted.length} client{sorted.length === 1 ? "" : "s"}
        </span>
      </form>
      {sorted.length === 0 ? (
        <EmptyState title="No clients found" description="Clients are created from applications." />
      ) : (
        <div className="bg-card rounded-xl border">
          <ClientTable items={sorted} />
        </div>
      )}
    </>
  );
}
