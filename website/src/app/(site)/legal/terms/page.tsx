import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/PageHeader";
import { LegalDocument } from "@/components/shared/LegalDocument";
import { terms } from "@/content/legal/terms";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms that apply when you apply for or accept a loan from Cashflow Loans.",
};

export default function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms and" highlight="Conditions" description="Please read these Terms carefully before entering into any loan agreement with us." />
      <LegalDocument document={terms} />
    </>
  );
}
