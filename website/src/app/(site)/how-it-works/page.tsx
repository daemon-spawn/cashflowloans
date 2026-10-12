import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatRand, loanRules } from "@cashflow/core";
import { Button } from "@cashflow/ui/components/button";

import { Container } from "@/components/shared/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { primaryCta } from "@/lib/site";
import houseAndPhone from "@public/images/house-and-phone.jpeg";
import atm from "@public/images/atm-cash.jpeg";
import carKeys from "@public/images/car-keys-handover.jpeg";

export const metadata: Metadata = {
  title: "How it works",
  description: "Two ways to borrow from Cashflow Loans: unsecured on your income, or secured against your phone, car or property.",
};

const loans = [
  {
    name: "Unsecured loan",
    range: [loanRules.minAmount, loanRules.unsecuredMaxAmount],
    summary: "No collateral. Approve a DebiCheck debit order and the money is in your account within 15 minutes.",
    href: "/how-it-works/unsecured",
    image: atm,
    alt: "R100 notes coming out of an ATM",
  },
  {
    name: "Secured loan",
    range: [loanRules.securedMinAmount, loanRules.securedMaxAmount],
    summary: "Against your phone, vehicle title or property. Free courier collection, and your item is insured while we hold it.",
    href: "/how-it-works/secured",
    image: carKeys,
    alt: "A smiling customer receiving car keys behind the wheel",
  },
] as const;

const comparison = [
  { label: "Amount", unsecured: `${formatRand(loanRules.minAmount)} – ${formatRand(loanRules.unsecuredMaxAmount)}`, secured: `${formatRand(loanRules.securedMinAmount)} – ${formatRand(loanRules.securedMaxAmount)}` },
  { label: "Term", unsecured: "1 month", secured: "1 month" },
  { label: "Security", unsecured: "None", secured: "Phone, vehicle title or property" },
  { label: "Documents", unsecured: "ID, payslip, 3-month bank statement", secured: "ID and photos of your collateral" },
  { label: "Payout", unsecured: "Within 15 minutes of DebiCheck approval", secured: "After your collateral is inspected" },
  { label: "Collection", unsecured: "Not needed", secured: "Free, nationwide" },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="How it works"
        title="Two ways to borrow."
        highlight="Pick the one that suits you."
        description="Borrow on your income alone, or use something you own as security for a larger amount. Either way it's a one-month loan and you see exactly what you'll repay before you apply."
        image={houseAndPhone}
        imageAlt="A phone held up in front of a house"
      >
        <Button asChild size="lg" variant="inverse">
          <Link href={primaryCta.href}>{primaryCta.label}</Link>
        </Button>
      </PageHeader>

      <section className="py-14 sm:py-20">
        <Container className="grid gap-5 md:grid-cols-2">
          {loans.map((l) => (
            <article key={l.name} className="bg-card group relative flex flex-col overflow-hidden rounded-[2rem]">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image src={l.image} alt={l.alt} fill placeholder="blur" sizes="(min-width: 768px) 45vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none" />
              </div>
              <div className="flex flex-1 flex-col p-7 sm:p-10">
                <h2 className="text-muted-foreground font-medium">{l.name}</h2>
                <p className="t-numeral text-brand-950 mt-3 text-[clamp(2.25rem,1.8rem+1.6vw,3.25rem)]">
                  {formatRand(l.range[0])}
                  <span className="text-brand-900"> – {formatRand(l.range[1])}</span>
                </p>
                <p className="text-muted-foreground mt-3 max-w-[40ch]">{l.summary}</p>
                <Link href={l.href} className="text-brand-900 mt-8 inline-flex items-center gap-2 self-start font-medium underline-offset-4 after:absolute after:inset-0 group-hover:underline">
                  How {l.name.toLowerCase()}s work
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </Container>
      </section>

      <section className="pb-20 sm:pb-28">
        <Container>
          <SectionHeading eyebrow="Side by side" title="Unsecured or" highlight="secured?" />
          <div className="bg-card mt-12 hidden overflow-hidden rounded-[2rem] sm:block">
            <table className="w-full text-left">
              <caption className="sr-only">Unsecured and secured loans compared</caption>
              <thead>
                <tr className="border-border border-b">
                  <th scope="col" className="w-[22%] px-7 py-6 sm:px-10"><span className="sr-only">Feature</span></th>
                  <th scope="col" className="t-h3 px-7 py-6 text-[1.25rem] sm:px-10">Unsecured</th>
                  <th scope="col" className="t-h3 px-7 py-6 text-[1.25rem] sm:px-10">Secured</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.label} className="border-border border-b last:border-b-0">
                    <th scope="row" className="text-muted-foreground px-7 py-5 font-normal sm:px-10">{row.label}</th>
                    <td className="px-7 py-5 sm:px-10">{row.unsecured}</td>
                    <td className="px-7 py-5 sm:px-10">{row.secured}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Phones: one card per row so both columns stay visible without sideways scrolling. */}
          <dl className="mt-10 grid gap-3 sm:hidden">
            {comparison.map((row) => (
              <div key={row.label} className="bg-card rounded-[1.5rem] p-6">
                <dt className="text-muted-foreground text-sm">{row.label}</dt>
                <dd className="mt-3 grid grid-cols-2 gap-4">
                  <span><span className="text-brand-900 block text-xs font-medium">Unsecured</span>{row.unsecured}</span>
                  <span><span className="text-brand-900 block text-xs font-medium">Secured</span>{row.secured}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <HowItWorks />
      <div className="pt-20 sm:pt-28">
        <CtaBanner />
      </div>
    </>
  );
}
