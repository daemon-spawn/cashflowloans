import type { Metadata } from "next";

import { PageTitle } from "@/components/shared/PageTitle";
import { EmptyState } from "@/components/shared/EmptyState";

export const metadata: Metadata = { title: "Loans" };

export default function LoansPage() {
  return (
    <>
      <PageTitle title="Loans" description="Active, due, overdue and settled loans." />
      <EmptyState title="Nothing here yet" description="Connected to the API in the CRM build phase." />
    </>
  );
}
