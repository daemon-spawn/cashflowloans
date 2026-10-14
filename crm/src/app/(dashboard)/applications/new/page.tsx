import type { Metadata } from "next";

import { NewApplicationForm } from "@/components/applications/NewApplicationForm";
import { BackLink } from "@/components/shared/BackLink";
import { PageTitle } from "@/components/shared/PageTitle";
import { api } from "@/lib/api";
import { todaySast } from "@/lib/format";
import type { Client } from "@/lib/types";

export const metadata: Metadata = { title: "New application" };

export default async function NewApplicationPage({ searchParams }: PageProps<"/applications/new">) {
  const { client: clientId } = await searchParams;
  const client = typeof clientId === "string" ? await api<Client>(`/clients/${clientId}`).catch(() => undefined) : undefined;
  return (
    <>
      <BackLink href={client ? `/clients/${client.id}` : "/applications"}>{client ? client.fullName : "Applications"}</BackLink>
      <PageTitle
        title={client ? `New loan for ${client.firstName}` : "New application"}
        description="For applications taken on WhatsApp, by phone, by email or in person. It joins the pipeline as New, like a website application."
      />
      <NewApplicationForm client={client} today={todaySast()} />
    </>
  );
}
