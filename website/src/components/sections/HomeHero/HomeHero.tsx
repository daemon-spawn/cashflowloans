import Image from "next/image";
import Link from "next/link";
import { company, whatsappLink } from "@cashflow/core";
import { Button } from "@cashflow/ui/components/button";

import { Container } from "@/components/shared/Container";
import { Highlight } from "@/components/shared/Highlight";
import { Pill } from "@/components/shared/Pill";
import { LoanCalculator } from "@/components/sections/LoanCalculator";
import { primaryCta } from "@/lib/site";
import customer from "@public/images/customer-smiling-with-r100-notes.jpeg";

/**
 * First viewport: what, who, cost and the next step. The customer photo fills
 * the screen; the calculator (the hero's slider) sits inside it as a frosted bar.
 */
export function HomeHero() {
  return (
    <section data-surface="dark" className="bg-brand-950 relative isolate overflow-hidden text-white">
      {/* Photo runs edge to edge; on large screens it starts a third in so her face sits beside the headline. */}
      <div aria-hidden className="absolute inset-0 -z-20 lg:left-[30%]">
        <Image src={customer} alt="" fill priority placeholder="blur" sizes="(min-width: 1024px) 70vw, 100vw" className="object-cover object-[45%_30%] lg:object-[20%_30%]" />
        <div className="from-brand-950 absolute inset-y-0 left-0 hidden w-2/5 bg-gradient-to-r to-transparent lg:block" />
      </div>
      <div aria-hidden className="from-brand-950/90 via-brand-950/70 to-brand-950/30 absolute inset-0 -z-10 bg-gradient-to-b lg:bg-gradient-to-r lg:from-brand-950 lg:via-brand-950/40 lg:via-35% lg:to-transparent lg:to-60%" />
      <div aria-hidden className="from-brand-950 absolute inset-x-0 bottom-0 -z-10 h-72 bg-gradient-to-t to-transparent" />

      <Container className="flex min-h-[calc(100svh-5rem)] flex-col pt-12 pb-8 sm:pt-16 lg:pb-10">
        <div className="max-w-[40rem] flex-1">
          <div className="animate-rise">
            <Pill tone="dark" href="/how-it-works">Secured & unsecured loans</Pill>
          </div>
          <h1 className="t-display animate-rise mt-6 [animation-delay:80ms]">
            Short-term loans from R100 to R100,000, <Highlight tone="dark">paid out fast.</Highlight>
          </h1>
          <p className="t-lead animate-rise mt-6 max-w-[32rem] text-white/80 [animation-delay:160ms]">
            Use your phone, car or property as security, or apply unsecured with your payslip. You see exactly what you&apos;ll
            repay before you apply.
          </p>
          <div className="animate-rise mt-8 flex flex-wrap items-center gap-3 [animation-delay:240ms]">
            <Button asChild size="lg" variant="inverse">
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </Button>
            <Button asChild size="lg" variant="onDark" className="bg-brand-950/30 backdrop-blur-sm">
              <a href={whatsappLink("Hi Cashflow Loans, I'd like to find out about a loan.")} target="_blank" rel="noopener noreferrer">
                WhatsApp {company.phoneDisplay}
              </a>
            </Button>
          </div>
        </div>

        {/* The hero's slider: always part of the first view. */}
        <div className="animate-rise mt-12 [animation-delay:320ms]">
          <LoanCalculator layout="bar" className="mx-auto max-w-[28rem] lg:max-w-none" />
        </div>
      </Container>
    </section>
  );
}
