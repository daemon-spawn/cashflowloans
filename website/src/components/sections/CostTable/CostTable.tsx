import Image from "next/image";
import { calculateRepayment, formatRand, loanRules } from "@cashflow/core";

import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import coins from "@public/images/coins-on-rand-notes.jpeg";

// TODO(owner): confirm cost wording and disclosure with the NCR compliance advisor
// before launch (design brief, open questions). Amounts come from loanRules.
const EXAMPLES = [500, 1_000, 2_000, 5_000, 10_000];

const terms = [
  { figure: `${loanRules.feeRate * 100}%`, label: "One flat fee", detail: `Charged once on what you borrow, for the full ${loanRules.termMonths}\u2011month term.` },
  { figure: "R0", label: "Nothing hidden", detail: "No application fee and no charge for collecting your collateral." },
  { figure: `+${loanRules.lateRate * 100}%`, label: "If you pay late", detail: "Added to what's still outstanding for each missed due date. Talk to us before it happens." },
];

/** Answers "what will it really cost?" with numbers, not adjectives. */
export function CostTable() {
  return (
    <section className="py-20 sm:py-28">
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-x-16">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow="What it costs" title="One fee, shown before you apply" />
          <dl className="border-border mt-10 border-t">
            {terms.map((t) => (
              <div key={t.label} className="border-border grid grid-cols-[6.5rem_minmax(0,1fr)] gap-5 border-b py-6">
                <dt className="font-display text-brand-900 text-[2.25rem] leading-none font-bold tracking-tight">{t.figure}</dt>
                <dd>
                  <p className="font-semibold">{t.label}</p>
                  <p className="text-muted-foreground mt-1 text-[0.9375rem]">{t.detail}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <figure className="bg-card border-border overflow-hidden rounded-2xl border lg:col-span-7 lg:self-start">
          <div className="relative aspect-[21/8]">
            <Image src={coins} alt="Rand coins stacked on bank notes" fill placeholder="blur" sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            <div className="from-brand-950/80 absolute inset-0 bg-gradient-to-t to-transparent" />
            <figcaption className="absolute bottom-5 left-6 text-white">
              <span className="t-meta text-brand-300">Example repayments</span>
              <span className="mt-1 block font-semibold">What you pay back after {loanRules.termMonths} month</span>
            </figcaption>
          </div>
          <div className="overflow-x-auto">
            <table className="t-tab w-full text-left">
              <thead>
                <tr className="border-border border-b">
                  <th scope="col" className="t-meta text-muted-foreground px-5 py-4 font-semibold whitespace-nowrap sm:px-7">You borrow</th>
                  <th scope="col" className="t-meta text-muted-foreground px-5 py-4 font-semibold whitespace-nowrap sm:px-7">Fee</th>
                  <th scope="col" className="t-meta text-brand-950 bg-marigold/20 px-5 py-4 text-right font-semibold whitespace-nowrap sm:px-7">You repay</th>
                </tr>
              </thead>
              <tbody>
                {EXAMPLES.map((amount) => {
                  const { fee, total } = calculateRepayment(amount);
                  return (
                    <tr key={amount} className="border-border border-b last:border-0">
                      <td className="px-5 py-4 text-lg font-medium sm:px-7">{formatRand(amount)}</td>
                      <td className="text-muted-foreground px-5 py-4 sm:px-7">+ {formatRand(fee)}</td>
                      <td className="bg-marigold/10 px-5 py-4 text-right text-xl font-bold sm:px-7">{formatRand(total)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground border-border border-t px-5 py-4 text-sm sm:px-7">
            Any amount from {formatRand(loanRules.minAmount)} to {formatRand(loanRules.maxAmount)}. Your exact repayment and due date are
            confirmed before you sign.
          </p>
        </figure>
      </Container>
    </section>
  );
}
