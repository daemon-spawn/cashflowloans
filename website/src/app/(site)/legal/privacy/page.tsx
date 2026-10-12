import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/PageHeader";
import { LegalDocument } from "@/components/shared/LegalDocument";
import { privacy } from "@/content/legal/privacy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Cashflow Loans collects, uses and protects your personal information under POPIA.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy" highlight="Policy" description="What we collect, why we need it and how we look after it." />
      <LegalDocument document={privacy} />
    </>
  );
}
