import type { Metadata } from "next";
import Link from "next/link";
import { formatRand, loanRules } from "@cashflow/core";
import { Button } from "@cashflow/ui/components/button";

import { PageHeader } from "@/components/shared/PageHeader";
import { LoanTypeDetail } from "@/components/sections/LoanTypeDetail";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { faqFor } from "@/content/faq";
import carKeys from "@public/images/car-keys-handover.jpeg";
import handedOver from "@public/images/rand-notes-handed-over.jpeg";

const range = `${formatRand(loanRules.securedMinAmount)} – ${formatRand(loanRules.securedMaxAmount)}`;

export const metadata: Metadata = {
  title: "Secured loans",
  description: `Borrow ${range} against your phone, vehicle title or property. Free courier collection and your item is insured while we hold it.`,
};

const steps = [
  { title: "Apply online", description: "Submit your application via our website, email, WhatsApp, or phone call." },
  { title: "Share your collateral", description: "Provide the required information, with photos of your phone, vehicle title or property documents." },
  { title: "Free collection", description: "Our trusted courier partners collect your item anywhere in South Africa, at no additional cost." },
  { title: "Inspection and payout", description: "After careful inspection of the collateral, the approved amount is transferred to your bank account." },
];

export default function SecuredPage() {
  return (
    <>
      <PageHeader
        eyebrow="How it works"
        eyebrowHref="/how-it-works"
        title="Secured loans,"
        highlight="backed by what you own."
        description={`Borrow ${range} using your phone, vehicle title or property as security. Your collateral is insured while we hold it.`}
        image={carKeys}
        imageAlt="A smiling customer receiving car keys behind the wheel"
        imagePosition="80% 50%"
      >
        <Button asChild size="lg" variant="inverse">
          <Link href="/apply?type=secured">Apply for a secured loan</Link>
        </Button>
      </PageHeader>
      <LoanTypeDetail
        facts={[
          { label: "Borrow", value: range },
          { label: "Term", value: `${loanRules.termMonths} month` },
          { label: "Collection", value: "Free" },
          { label: "Collateral", value: "Insured" },
        ]}
        steps={steps}
        stepsImage={handedOver}
        stepsImageAlt="Rand notes being handed over"
        needs={[
          "Your South African ID",
          "Photos of your phone, or your vehicle title or property documents",
          "Your cellphone number and email, so we can arrange the free courier collection",
        ]}
        needsNote="All items we hold are insured against unforeseen circumstances, and kept secure and well-maintained during the loan period."
        faqs={faqFor("secured")}
      />
      <CtaBanner />
    </>
  );
}
