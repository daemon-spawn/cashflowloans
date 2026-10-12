import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatRand, loanRules } from "@cashflow/core";
import { Button } from "@cashflow/ui/components/button";

import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { primaryCta } from "@/lib/site";
import logoAlt from "@public/images/logo-alt.jpeg";
import approved from "@public/images/personal-loan-approved.jpg";
import phone from "@public/images/applying-on-phone.jpeg";

type Route = {
  name: string;
  range: [number, number];
  summary: string;
  needs: string[];
  href: string;
  cta: string;
  image: StaticImageData;
  alt: string;
};

const routes: Route[] = [
  {
    name: "Unsecured loan",
    range: [loanRules.minAmount, loanRules.unsecuredMaxAmount],
    summary: "For people with a regular income. Nothing to hand over.",
    needs: ["Your SA ID", "Latest payslip", "3-month bank statement (PDF)", "A DebiCheck debit order with your bank"],
    href: "/how-it-works/unsecured",
    cta: "How unsecured loans work",
    image: approved,
    alt: "A personal loan form stamped approved",
  },
  {
    name: "Secured loan",
    range: [loanRules.securedMinAmount, loanRules.securedMaxAmount],
    summary: "Using your phone, car or property as security.",
    needs: ["Your SA ID", "Photos of your item, car title or property papers", "Free courier collection, nationwide", "Insured while we hold it"],
    href: "/how-it-works/secured",
    cta: "How secured loans work",
    image: phone,
    alt: "A smartphone, one of the items you can use as security",
  },
];

/** "What We're Offering / All Loans Services" from the original homepage, then the two ways to borrow. */
export function LoanRoutes() {
  return (
    <section className="pb-20 sm:pb-28">
      <Container>
        <SectionHeading eyebrow="What We’re Offering" title="All Loans" highlight="Services" />

        <article className="bg-card mt-12 grid overflow-hidden rounded-[2rem] md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[22rem]">
            <Image src={logoAlt} alt="Cashflow Loans emblem with cars and coins" fill placeholder="blur" sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-12">
            <h3 className="t-h2 text-[clamp(2rem,1.6rem+1.4vw,2.75rem)]">Personal Loan</h3>
            <p className="t-lead text-ink/75 mt-5">
              Cashflow Loans offers fast, micro, secured, and unsecured loans for those ineligible for bank loans using assets as
              collateral, with transparent terms, rapid approvals, and inclusive financial solutions.
            </p>
            <Button asChild size="lg" className="mt-9 self-start">
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </Button>
          </div>
        </article>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {routes.map((r) => (
            <article key={r.name} className="bg-card flex flex-col overflow-hidden rounded-[2rem]">
              <div className="relative aspect-[16/9]">
                <Image src={r.image} alt={r.alt} fill placeholder="blur" sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-7 sm:p-10">
                <h3 className="text-muted-foreground font-medium">{r.name}</h3>
                <p className="t-numeral text-brand-950 mt-3 text-[clamp(2.25rem,1.8rem+1.6vw,3.25rem)]">
                  {formatRand(r.range[0])}
                  <span className="text-brand-900"> – {formatRand(r.range[1])}</span>
                </p>
                <p className="text-muted-foreground mt-3">{r.summary}</p>
                <ul className="border-border mt-7 border-t">
                  {r.needs.map((n) => (
                    <li key={n} className="border-border border-b py-3">{n}</li>
                  ))}
                </ul>
                <Link href={r.href} className="text-brand-900 group mt-7 inline-flex items-center gap-2 self-start font-medium underline-offset-4 hover:underline">
                  {r.cta}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
