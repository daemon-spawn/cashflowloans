import Link from "next/link";
import { company, whatsappLink } from "@cashflow/core";
import { Button } from "@cashflow/ui/components/button";

import { Container } from "@/components/shared/Container";
import { LoanCalculator } from "@/components/sections/LoanCalculator";
import { primaryCta } from "@/lib/site";

/** First viewport: what, who, cost and the next step (design brief, Gate 3). */
export function HomeHero() {
  return (
    <section className="bg-brand-950 relative isolate overflow-hidden text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(var(--brand-300)_1px,transparent_1px),linear-gradient(90deg,var(--brand-300)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
      <Container className="grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_25rem] lg:gap-16 lg:py-24">
        <div>
          <p className="t-meta text-brand-300">Secured & unsecured · South Africa</p>
          <h1 className="t-display mt-5">Short-term loans from R100 to R100,000, paid out fast.</h1>
          <p className="t-lead mt-6 max-w-[34rem] text-white/80">
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
        <LoanCalculator />
      </Container>
    </section>
  );
}
