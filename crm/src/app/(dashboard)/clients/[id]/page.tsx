import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@cashflow/ui/components/button";

import { ApplicationTable } from "@/components/applications/ApplicationTable";
import { BlacklistDialog } from "@/components/clients/BlacklistDialog";
import { EditClientDialog } from "@/components/clients/EditClientDialog";
import { LoanTable } from "@/components/loans/LoanTable";
import { ActivityList } from "@/components/records/ActivityList";
import { DocumentsPanel } from "@/components/records/DocumentsPanel";
import { NotesPanel } from "@/components/records/NotesPanel";
import { BackLink } from "@/components/shared/BackLink";
import { ContactLinks } from "@/components/shared/ContactLinks";
import { DetailList } from "@/components/shared/DetailList";
import { PageTitle } from "@/components/shared/PageTitle";
import { Panel } from "@/components/shared/Panel";
import { Stat } from "@/components/shared/Stat";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ApiError, api } from "@/lib/api";
import { rand, shortDate, todaySast } from "@/lib/format";
import type { ClientDetail } from "@/lib/types";

export const metadata: Metadata = { title: "Client" };

async function getClient(id: string) {
  try {
    return await api<ClientDetail>(`/clients/${id}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }
}

export default async function ClientPage({ params }: PageProps<"/clients/[id]">) {
  const c = await getClient((await params).id);
  const today = todaySast();
  return (
    <>
      <BackLink href="/clients">Clients</BackLink>
      <PageTitle
        title={c.fullName}
        badges={
          <>
            <StatusBadge status={c.standing} />
            {c.blacklisted && <StatusBadge status="blacklisted" />}
          </>
        }
        description={`Client since ${shortDate(c.createdAt)} · ID ${c.idNumber}`}
        actions={
          <>
            <BlacklistDialog client={c} />
            <Button asChild>
              <Link href={`/applications/new?client=${c.id}`}>
                <Plus className="size-4" aria-hidden /> New loan
              </Link>
            </Button>
          </>
        }
      />
      {c.blacklisted && (
        <p className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          <strong>Blacklisted:</strong> {c.blacklistReason}
        </p>
      )}

      <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Outstanding" value={rand(c.outstanding)} tone={c.standing === "overdue" ? "alert" : "default"} hint={c.nextDueDate ? `Next due ${shortDate(c.nextDueDate)}` : undefined} />
        <Stat label="Borrowed in total" value={rand(c.borrowed)} hint={`${c.loans} loan${c.loans === 1 ? "" : "s"}`} />
        <Stat label="Repaid in total" value={rand(c.repaid)} />
        <Stat label="Applications" value={c.applications} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid min-w-0 content-start gap-5">
          <Panel title="Loans" bodyClassName="p-0 sm:p-2">
            <div className="px-5 py-3 sm:px-3">
              {c.loanList.length ? <LoanTable items={c.loanList} today={today} showClient={false} /> : <p className="text-muted-foreground text-sm">No loans yet.</p>}
            </div>
          </Panel>
          <Panel title="Applications" bodyClassName="p-0">
            {c.applicationList.length ? <ApplicationTable items={c.applicationList} framed={false} /> : <p className="text-muted-foreground p-5 text-sm">No applications.</p>}
          </Panel>
          <DocumentsPanel documents={c.documents} uploadPath={`/clients/${c.id}/documents`} />
        </div>
        <div className="grid content-start gap-5">
          <Panel title="Contact" actions={<EditClientDialog client={c} />}>
            <DetailList
              items={[
                ["Phone", c.phone],
                ["Email", c.email],
                ["ID number", c.idNumber],
              ]}
            />
            <ContactLinks className="mt-4" phone={c.phone} email={c.email} />
          </Panel>
          <NotesPanel clientId={c.id} notes={c.notes} />
          <ActivityList items={c.activity} />
        </div>
      </div>
    </>
  );
}
