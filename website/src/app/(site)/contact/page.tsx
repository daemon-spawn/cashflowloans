import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { company, whatsappLink } from "@cashflow/core";
import { Button } from "@cashflow/ui/components/button";

import { Container } from "@/components/shared/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ContactForm } from "@/components/forms/ContactForm";
import customer from "@public/images/customer-celebrating-yellow.jpeg";

export const metadata: Metadata = {
  title: "Contact us",
  description: `Call, WhatsApp or email Cashflow Loans. ${company.phoneDisplay} · ${company.email}`,
};

const channels = [
  { label: "WhatsApp", value: company.phoneDisplay, href: whatsappLink("Hi Cashflow Loans, I'd like to find out about a loan."), note: "Fastest reply" },
  { label: "Call Anytime", value: company.phoneDisplay, href: `tel:${company.phone}`, note: company.hours },
  { label: "Write Email", value: company.email, href: `mailto:${company.email}` },
  { label: "Visit Office", value: company.country },
];

/** "Get in touch with us / Ask for your query" from the original contact page. */
export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Get in touch with us"
        title="Ask for"
        highlight="your query."
        description="WhatsApp is the fastest way to reach us. You can also call, email or send a message below."
        image={customer}
        imageAlt="A happy customer celebrating while looking at a phone"
      >
        <Button asChild size="lg" variant="inverse">
          <a href={channels[0].href} target="_blank" rel="noopener noreferrer">WhatsApp {company.phoneDisplay}</a>
        </Button>
      </PageHeader>

      <section className="py-14 sm:py-20">
        <Container>
          <ul className="bg-border grid gap-px overflow-hidden rounded-[2rem] sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.4fr_0.9fr]">
            {channels.map((c) => (
              <li key={c.label} className="bg-card relative p-7 sm:p-9">
                <p className="text-muted-foreground text-[0.9375rem]">{c.label}</p>
                {c.href ? (
                  <a
                    href={c.href}
                    {...(c.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
                    className="t-h3 text-brand-950 group mt-3 flex items-start justify-between gap-3 text-[1.25rem] [overflow-wrap:anywhere] after:absolute after:inset-0 hover:underline hover:underline-offset-4"
                  >
                    {c.value}
                    <ArrowUpRight className="text-brand-700 mt-1 size-5 shrink-0" aria-hidden />
                  </a>
                ) : (
                  <p className="t-h3 text-brand-950 mt-3 text-[1.25rem]">{c.value}</p>
                )}
                {c.note && <p className="text-muted-foreground mt-2 text-sm">{c.note}</p>}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="pb-20 sm:pb-28">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <SectionHeading eyebrow="Send A Message" title="We'll get" highlight="back to you." description="Questions about a loan, an application or a repayment? Leave your details and our team will contact you." />
          <div className="bg-card rounded-[2rem] p-6 sm:p-10">
            <ContactForm />
          </div>
        </Container>
      </section>
    </>
  );
}
