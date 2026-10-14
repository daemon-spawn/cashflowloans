import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { Button } from "@cashflow/ui/components/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@cashflow/ui/components/table";
import { cn } from "@cashflow/ui/lib/utils";

import { EmptyState } from "@/components/shared/EmptyState";
import { PageTitle } from "@/components/shared/PageTitle";
import { Panel } from "@/components/shared/Panel";
import { Stat } from "@/components/shared/Stat";
import { Tabs } from "@/components/shared/Tabs";
import { api } from "@/lib/api";
import { rand, shortDate } from "@/lib/format";
import { TIMEFRAMES, timeframeOf } from "@/lib/reports";
import type { Analytics } from "@/lib/types";

export const metadata: Metadata = { title: "Reports" };

export default async function ReportsPage({ searchParams }: PageProps<"/reports">) {
  const timeframe = timeframeOf((await searchParams).timeframe);
  const a = await api<Analytics>(`/reports/analytics?timeframe=${timeframe}`);
  const net = Number(a.net);

  return (
    <>
      <PageTitle
        title="Reports"
        description={a.since ? `Since ${shortDate(a.since)}` : "Since the first loan"}
        actions={
          <Button asChild variant="outline">
            <a href={`/reports/export?timeframe=${timeframe}`}>
              <Download className="size-4" aria-hidden /> Export CSV
            </a>
          </Button>
        }
      />
      <Tabs active={timeframe} items={Object.entries(TIMEFRAMES).map(([value, label]) => ({ value, label, href: `/reports?timeframe=${value}` }))} />

      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="New clients" value={a.newClients} />
        <Stat label="Paid out" value={rand(a.loaned)} hint="Principal of loans paid out in the period" />
        <Stat label="Collected" value={rand(a.collected)} hint="Payments received in the period" />
        <Stat label="Cash in minus cash out" value={`${net < 0 ? "−" : ""}${rand(Math.abs(net))}`} tone={net < 0 ? "alert" : "default"} hint="Collected minus paid out" />
      </div>

      <Panel title="Top 20 clients by amount repaid" description="Totals are across each client's whole history." bodyClassName="p-0">
        {a.topClients.length === 0 ? (
          <div className="p-5">
            <EmptyState title="No repayments yet" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="text-right">Loaned</TableHead>
                <TableHead className="text-right">Repaid</TableHead>
                <TableHead className="text-right">Outstanding</TableHead>
                <TableHead className="text-right">Profit</TableHead>
                <TableHead>Last activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {a.topClients.map((c, i) => (
                <TableRow key={c.clientId} className="relative">
                  <TableCell className="text-muted-foreground tabular-nums">{i + 1}</TableCell>
                  <TableCell>
                    <Link href={`/clients/${c.clientId}`} className="font-medium after:absolute after:inset-0 hover:underline">
                      {c.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{rand(c.loaned)}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{rand(c.repaid)}</TableCell>
                  <TableCell className="text-right tabular-nums">{Number(c.outstanding) > 0 ? rand(c.outstanding) : "Paid off"}</TableCell>
                  <TableCell className={cn("text-right tabular-nums", Number(c.profit) < 0 && "text-destructive")}>
                    {Number(c.profit) < 0 ? `−${rand(-Number(c.profit))}` : rand(c.profit)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{shortDate(c.lastActivity)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Panel>
    </>
  );
}
