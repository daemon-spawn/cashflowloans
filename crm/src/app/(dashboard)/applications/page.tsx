import type { Metadata } from "next";

import { PageTitle } from "@/components/shared/PageTitle";
import { PipelineBoard } from "@/components/applications/PipelineBoard";

export const metadata: Metadata = { title: "Applications" };

export default function ApplicationsPage() {
  return (
    <>
      <PageTitle title="Applications" description="Website applications flow in here as New." />
      <PipelineBoard />
    </>
  );
}
