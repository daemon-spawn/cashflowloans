import Image from "next/image";
import Link from "next/link";
import { company, whatsappLink } from "@cashflow/core";
import { Button } from "@cashflow/ui/components/button";

import { Container } from "@/components/shared/Container";
import { LoanCalculator } from "@/components/sections/LoanCalculator";
import { primaryCta } from "@/lib/site";
import customer from "@public/images/customer-smiling-with-r100-notes.jpeg";

/** First viewport: what, who, cost and the next step (design brief, Gate 3). */
export function HomeHero() {
  return (
    <section className="relative">
      <div className="bg-brand-950 absolute inset-x-0 top-0 bottom-24 -z-10 lg:bottom-32" aria-hidden />
      <Container className="grid items-center gap-10 pt-12 text-white sm:pt-16 lg:grid-cols-12 lg:gap-x-12 lg:pt-20">
        <div className="lg:col-span-6">
          <p className="t-meta text-brand-300">Secured & unsecured loans · South Africa</p>
          <h1 className="t-display mt-5">Short-term loans from R100 to R100,000, paid out fast.</h1>
          <p className="t-lead mt-6 max-w-[33rem] text-white/80">
            Use your phone, car or property as security, or apply unsecured with your payslip. You see exactly what you&apos;ll
            repay before you apply.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </Button>
            <Button asChild size="lg" variant="onDark">
              <a href={whatsappLink("Hi Cashflow Loans, I'd like to find out about a loan.")} target="_blank" rel="noopener noreferrer">
                WhatsApp {company.phoneDisplay}
              </a>
            </Button>
          </div>
          <p className="mt-5 text-sm text-white/60">Takes about 5 minutes. Have your ID ready.</p>
        </div>

        <div className="lg:col-span-6">
          <div className="relative aspect-[3/2] overflow-hidden rounded-xl">
            <Image
              src={customer}
              alt="A smiling customer holding R100 notes"
              fill
              priority
              placeholder="blur"
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
      {/* The calculator straddles the edge of the dark band so cost is visible in the first viewport. */}
      <Container className="mt-10 pb-12 lg:mt-14 lg:pb-16">
        <LoanCalculator layout="bar" className="mx-auto max-w-[28rem] lg:max-w-none" />
      </Container>
    </section>
  );
}
