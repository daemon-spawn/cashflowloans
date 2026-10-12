import type { Metadata } from "next";
import Link from "next/link";
import { formatRand, loanRules } from "@cashflow/core";
import { Button } from "@cashflow/ui/components/button";

import { PageHeader } from "@/components/shared/PageHeader";
import { LoanTypeDetail } from "@/components/sections/LoanTypeDetail";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { faqFor } from "@/content/faq";
import atm from "@public/images/atm-cash.jpeg";
import laptop from "@public/images/working-on-laptop.jpeg";

const range = `${formatRand(loanRules.minAmount)} – ${formatRand(loanRules.unsecuredMaxAmount)}`;

export const metadata: Metadata = {
  title: "Unsecured loans",
  description: `Borrow ${range} with no collateral. Approve a DebiCheck and the money is in your account within 15 minutes.`,
};

const steps = [
  { title: "Apply online", description: "Submit your application through our website, WhatsApp, or phone call." },
  { title: "Upload your documents", description: "Your ID, latest payslip and a 3-month bank statement." },
  { title: "Get approved", description: "You will receive an email notification confirming the success of your application." },
  { title: "Approve DebiCheck", description: "Authorise the debit order with your bank. The money is in your account within 15 minutes." },
];

export default function UnsecuredPage() {
  return (
    <>
      <PageHeader
        eyebrow="How it works"
        eyebrowHref="/how-it-works"
        title="Unsecured loans,"
        highlight="nothing to hand over."
        description={`Borrow ${range} on your income alone. Approve a DebiCheck debit order with your bank and the money is paid out within 15 minutes.`}
        image={atm}
        imageAlt="R100 notes coming out of an ATM"
      >
        <Button asChild size="lg" variant="inverse">
          <Link href="/apply?type=unsecured">Apply for an unsecured loan</Link>
        </Button>
      </PageHeader>
      <LoanTypeDetail
        facts={[
          { label: "Borrow", value: range },
          { label: "Term", value: `${loanRules.termMonths} month` },
          { label: "Payout", value: "15 min" },
          { label: "Collateral", value: "None" },
        ]}
        steps={steps}
        stepsImage={laptop}
        stepsImageAlt="Someone working through documents on a laptop"
        needs={["Your South African ID", "Your latest payslip", "A 3-month bank statement (PDF)", "A bank account that supports DebiCheck"]}
        needsNote="DebiCheck means you confirm the debit order with your bank yourself, so nothing comes off your account without your approval."
        faqs={faqFor("unsecured")}
      />
      <CtaBanner />
    </>
  );
}
