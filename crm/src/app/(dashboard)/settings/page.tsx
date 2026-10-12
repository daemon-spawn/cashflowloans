import type { Metadata } from "next";

import { PageTitle } from "@/components/shared/PageTitle";
import { EmptyState } from "@/components/shared/EmptyState";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <>
      <PageTitle title="Settings" description="Staff access and notification preferences." />
      <EmptyState title="Nothing here yet" description="Connected to the API in the CRM build phase." />
    </>
  );
}
