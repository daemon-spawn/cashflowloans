import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@cashflow/ui/components/button";
import { formatRand, loanRules } from "@cashflow/core";

import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { primaryCta } from "@/lib/site";
import logoAlt from "@public/images/logo-alt.jpeg";
import approved from "@public/images/personal-loan-approved.jpg";
import phone from "@public/images/applying-on-phone.jpeg";

type Route = {
  name: string;
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
    summary: "For people with a regular income. Nothing to hand over.",
    needs: ["Your SA ID", "Latest payslip", "3-month bank statement (PDF)", "A DebiCheck debit order with your bank"],
    href: "/how-it-works/unsecured",
    cta: "How unsecured loans work",
    image: approved,
    alt: "A personal loan form stamped approved",
  },
  {
    name: "Secured loan",
    summary: `From ${formatRand(loanRules.securedMinAmount)}, using your phone, car or property as security.`,
    needs: ["Your SA ID", "Photos of your item, car title or property papers", "Free courier collection, nationwide", "Insured while we hold it"],
    href: "/how-it-works/secured",
    cta: "How secured loans work",
    image: phone,
    alt: "A smartphone, one of the items you can use as security",
  },
];

/**
 * "What We're Offering / All Loans Services" from the original homepage: the
 * Personal Loan card (copy and image unchanged), then the two ways to borrow.
 */
export function LoanRoutes() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="What We’re Offering" title="All Loans Services" />
        <article className="bg-card border-border mt-12 grid overflow-hidden rounded-2xl border md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div className="relative aspect-[16/9] md:aspect-auto md:min-h-[20rem]">
            <Image src={logoAlt} alt="Cashflow Loans emblem with cars and coins" fill placeholder="blur" sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-10">
            <h3 className="t-h3 text-[1.75rem]">Personal Loan</h3>
            <p className="t-lead text-ink/80 mt-4">
              Cashflow Loans offers fast, micro, secured, and unsecured loans for those ineligible for bank loans using assets as
              collateral, with transparent terms, rapid approvals, and inclusive financial solutions.
            </p>
            <Button asChild size="lg" className="mt-8 self-start">
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </Button>
          </div>
        </article>
        <h3 className="t-meta text-muted-foreground mt-16">Two ways to borrow</h3>
        <div className="mt-6 grid gap-x-8 gap-y-14 md:grid-cols-2">
          {routes.map((r) => (
            <article key={r.name} className="flex flex-col">
              <div className="relative aspect-[3/2] overflow-hidden rounded-xl">
                <Image src={r.image} alt={r.alt} fill placeholder="blur" sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
              </div>
              <h3 className="t-h3 mt-7 text-[1.625rem]">{r.name}</h3>
              <p className="text-muted-foreground mt-2">{r.summary}</p>
              <ul className="border-border mt-6 border-t">
                {r.needs.map((n) => (
                  <li key={n} className="border-border border-b py-3">{n}</li>
                ))}
              </ul>
              <Link href={r.href} className="text-brand-900 group mt-6 inline-flex items-center gap-2 self-start font-semibold underline-offset-4 hover:underline">
                {r.cta}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
