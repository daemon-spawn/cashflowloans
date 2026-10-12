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
      {/* Dark band with the customer photo as its background. It stops short so the calculator straddles its edge. */}
      <div className="bg-brand-950 absolute inset-x-0 top-0 bottom-24 -z-10 overflow-hidden lg:bottom-32" aria-hidden>
        {/* Large screens: the photo keeps its own proportions at the top right (her face and the R100 notes both in frame) and fades into the green on its left and bottom edges. */}
        <div className="absolute inset-0 lg:inset-auto lg:top-0 lg:right-0 lg:aspect-[1600/1021] lg:w-[64%]">
          <Image
            src={customer}
            alt=""
            fill
            priority
            placeholder="blur"
            sizes="(min-width: 1024px) 62vw, 100vw"
            className="object-cover object-[40%_25%] opacity-75 lg:opacity-90"
          />
          <div className="from-brand-950 absolute inset-0 hidden bg-gradient-to-r via-brand-950/40 via-30% to-transparent to-60% lg:block" />
          <div className="from-brand-950 absolute inset-0 hidden bg-gradient-to-t via-transparent via-30% lg:block" />
        </div>
        {/* Phones: the photo sits behind the text, so a stronger overlay keeps the headline readable. */}
        <div className="from-brand-950/60 via-brand-950/75 to-brand-950 absolute inset-0 bg-gradient-to-b lg:hidden" />
      </div>

      <Container className="pt-16 text-white sm:pt-24 lg:min-h-[34rem] lg:pt-28">
        <div className="max-w-[38rem]">
          <p className="t-meta text-brand-300">Secured & unsecured loans · South Africa</p>
          <h1 className="t-display mt-5">Short-term loans from R100 to R100,000, paid out fast.</h1>
          <p className="t-lead mt-6 max-w-[33rem] text-white/85">
            Use your phone, car or property as security, or apply unsecured with your payslip. You see exactly what you&apos;ll
            repay before you apply.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
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

      {/* The calculator straddles the edge of the dark band so cost is visible in the first viewport. */}
      <Container className="mt-12 pb-12 lg:mt-16 lg:pb-16">
        <LoanCalculator layout="bar" className="mx-auto max-w-[28rem] lg:max-w-none" />
      </Container>
    </section>
  );
}
