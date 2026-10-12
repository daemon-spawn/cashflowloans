import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { StepList } from "@/components/sections/StepList";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const metadata: Metadata = { title: "Unsecured loans" };

const steps = [
  { title: "Apply online", description: "Complete the form or contact us on WhatsApp or by phone." },
  { title: "Upload documents", description: "Your ID, latest payslip and 3-month bank statement." },
  { title: "Get approved", description: "We review your application and confirm by email." },
  { title: "Approve DebiCheck", description: "Confirm the debit order with your bank — funds arrive within 15 minutes." },
];

export default function UnsecuredPage() {
  return (
    <>
      <PageHeader title="Unsecured loans" description="No collateral needed." />
      <Container className="py-20"><StepList steps={steps} /></Container>
      <CtaBanner />
    </>
  );
}
