import Image from "next/image";
import Link from "next/link";
import { company, whatsappLink } from "@cashflow/core";
import { Button } from "@cashflow/ui/components/button";

import { Container } from "@/components/shared/Container";
import { LoanCalculator } from "@/components/sections/LoanCalculator";
import { primaryCta } from "@/lib/site";
import customer from "@public/images/customer-smiling-with-r100-notes.jpeg";

/**
 * First viewport: what, who, cost and the next step (design brief, Gate 3).
 * The customer photo fills the whole screen under the header; a deep-green
 * overlay keeps the headline readable.
 */
export function HomeHero() {
  return (
    <section>
      <div data-surface="dark" className="bg-brand-950 relative isolate flex min-h-[calc(100svh-5rem)] items-center overflow-hidden text-white">
        {/*
          The photo runs edge to edge (top, right, bottom). On large screens it starts
          a third of the way in so her face sits beside the headline rather than under
          it; its left edge fades into the deep green behind the text.
        */}
        <div aria-hidden className="absolute inset-0 -z-20 lg:left-[30%]">
          <Image src={customer} alt="" fill priority placeholder="blur" sizes="(min-width: 1024px) 70vw, 100vw" className="object-cover object-[45%_30%] lg:object-[20%_30%]" />
          <div className="from-brand-950 absolute inset-y-0 left-0 hidden w-2/5 bg-gradient-to-r to-transparent lg:block" />
        </div>
        <div aria-hidden className="from-brand-950/90 via-brand-950/70 to-brand-950/25 absolute inset-0 -z-10 bg-gradient-to-b lg:bg-gradient-to-r lg:from-brand-950 lg:via-brand-950/40 lg:via-35% lg:to-transparent lg:to-60%" />
        <div aria-hidden className="from-brand-950 absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t to-transparent" />

        <Container className="pt-16 pb-36 sm:pt-20 lg:pb-44">
          <div className="max-w-[36rem]">
            <p className="t-meta text-gold">Secured & unsecured loans · South Africa</p>
            <h1 className="t-display mt-5">Short-term loans from R100 to R100,000, paid out fast.</h1>
            <p className="t-lead mt-6 max-w-[33rem] text-white/85">
              Use your phone, car or property as security, or apply unsecured with your payslip. You see exactly what you&apos;ll
              repay before you apply.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" variant="inverse">
                <Link href={primaryCta.href}>{primaryCta.label}</Link>
              </Button>
              <Button asChild size="lg" variant="onDark" className="bg-brand-950/40 backdrop-blur-sm">
                <a href={whatsappLink("Hi Cashflow Loans, I'd like to find out about a loan.")} target="_blank" rel="noopener noreferrer">
                  WhatsApp {company.phoneDisplay}
                </a>
              </Button>
            </div>
            <p className="mt-5 text-sm text-white/70">Takes about 5 minutes. Have your ID ready.</p>
          </div>
        </Container>
      </div>

      {/* The calculator overlaps the bottom of the full-screen photo so cost stays close to the first view. */}
      <Container className="relative z-10 -mt-24 pb-12 lg:-mt-28 lg:pb-16">
        <LoanCalculator layout="bar" className="mx-auto max-w-[28rem] lg:max-w-none" />
      </Container>
    </section>
  );
}
