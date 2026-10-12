import type { Metadata } from "next";

import { PageTitle } from "@/components/shared/PageTitle";
import { EmptyState } from "@/components/shared/EmptyState";

export const metadata: Metadata = { title: "Overview" };

export default function OverviewPage() {
  return (
    <>
      <PageTitle title="Overview" description="Today's applications, money out, and repayments due." />
      <EmptyState title="Nothing here yet" description="Connected to the API in the CRM build phase." />
    </>
  );
}
