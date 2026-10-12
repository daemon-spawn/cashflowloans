import type { Metadata } from "next";

import { PageTitle } from "@/components/shared/PageTitle";
import { EmptyState } from "@/components/shared/EmptyState";

export const metadata: Metadata = { title: "Clients" };

export default function ClientsPage() {
  return (
    <>
      <PageTitle title="Clients" description="Everyone who has applied or borrowed, one record per ID number." />
      <EmptyState title="Nothing here yet" description="Connected to the API in the CRM build phase." />
    </>
  );
}
