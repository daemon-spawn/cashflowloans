import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { formatRand, loanRules } from "@cashflow/core";

import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

const routes = [
  {
    name: "Unsecured loan",
    summary: "For people with a regular income. Nothing to hand over.",
    needs: ["Your SA ID", "Latest payslip", "3-month bank statement (PDF)", "A DebiCheck debit order with your bank"],
    href: "/how-it-works/unsecured",
    cta: "How unsecured loans work",
  },
  {
    name: "Secured loan",
    summary: `From ${formatRand(loanRules.securedMinAmount)}, using something you own as security.`,
    needs: ["Your SA ID", "Photos of your phone, car title or property papers", "Free courier collection, nationwide", "Insured while we hold it"],
    href: "/how-it-works/secured",
    cta: "How secured loans work",
  },
];

/** Routes the visitor to the right product by what they have (design brief, Gate 3). */
export function LoanRoutes() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Two ways to borrow" title="Pick the loan that fits what you have" />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {routes.map((r) => (
            <article key={r.name} className="bg-card border-border flex flex-col rounded-2xl border p-7 sm:p-8">
              <h3 className="t-h3 text-[1.5rem]">{r.name}</h3>
              <p className="text-muted-foreground mt-2">{r.summary}</p>
              <p className="t-meta text-brand-900 mt-7">What you need</p>
              <ul className="mt-3 grid gap-2.5">
                {r.needs.map((n) => (
                  <li key={n} className="flex gap-3">
                    <Check className="text-brand-700 mt-1 size-4 shrink-0" aria-hidden />
                    {n}
                  </li>
                ))}
              </ul>
              <Link href={r.href} className="text-brand-900 group mt-8 inline-flex items-center gap-2 self-start font-semibold underline-offset-4 hover:underline">
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
