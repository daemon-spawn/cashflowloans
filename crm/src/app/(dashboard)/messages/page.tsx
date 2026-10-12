import type { Metadata } from "next";

import { PageTitle } from "@/components/shared/PageTitle";
import { EmptyState } from "@/components/shared/EmptyState";

export const metadata: Metadata = { title: "Messages" };

export default function MessagesPage() {
  return (
    <>
      <PageTitle title="Messages" description="Enquiries from the website contact form." />
      <EmptyState title="Nothing here yet" description="Connected to the API in the CRM build phase." />
    </>
  );
}
