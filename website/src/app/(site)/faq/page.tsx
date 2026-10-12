import type { Metadata } from "next";
import Image from "next/image";
import { company, whatsappLink } from "@cashflow/core";
import { Button } from "@cashflow/ui/components/button";

import { Container } from "@/components/shared/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { FaqList } from "@/components/sections/FaqList";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { faq } from "@/content/faq";
import notes from "@public/images/hand-with-rand-notes.jpeg";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description: "Answers about secured and unsecured loans, DebiCheck, collateral, payouts and your personal information.",
};

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="Frequently Asked Questions"
        title="Have Any"
        highlight="Questions?"
        description="Everything you need to know about borrowing from Cashflow Loans. Can't find your answer? Our team is on WhatsApp."
      />
      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-20">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem]">
              <Image src={notes} alt="A hand holding out a fan of Rand notes" fill placeholder="blur" sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" />
            </div>
            <div className="bg-card mt-5 rounded-[1.75rem] p-7">
              <p className="t-h3 text-[1.25rem]">Still unsure?</p>
              <p className="text-muted-foreground mt-2">Ask us directly on WhatsApp or by phone, {company.hours}.</p>
              <Button asChild className="mt-6">
                <a href={whatsappLink("Hi Cashflow Loans, I have a question.")} target="_blank" rel="noopener noreferrer">WhatsApp {company.phoneDisplay}</a>
              </Button>
            </div>
          </aside>
          <FaqList items={faq} />
        </Container>
      </section>
      <CtaBanner title="Ready when you are" />
    </>
  );
}
