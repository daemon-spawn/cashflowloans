import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { StepList } from "@/components/sections/StepList";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const metadata: Metadata = { title: "Secured loans" };

const steps = [
  { title: "Apply online", description: "Complete the form or contact us on WhatsApp, email or phone." },
  { title: "Share your collateral", description: "Upload photos of your phone, vehicle title or property documents." },
  { title: "Free collection", description: "Our courier partners collect your item at no cost, nationwide." },
  { title: "Get paid", description: "Once your collateral is inspected, the approved amount is paid out." },
];

export default function SecuredPage() {
  return (
    <>
      <PageHeader title="Secured loans" description="Borrow from R500 against an asset you own. Your collateral is insured while we hold it." />
      <Container className="py-20"><StepList steps={steps} /></Container>
      <CtaBanner />
    </>
  );
}
