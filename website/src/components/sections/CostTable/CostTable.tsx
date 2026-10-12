import { calculateRepayment, formatRand, loanRules } from "@cashflow/core";

import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

// TODO(owner): confirm cost wording and disclosure with the NCR compliance advisor
// before launch (design brief, open questions). Amounts come from loanRules.
const EXAMPLES = [500, 1_000, 2_000, 5_000, 10_000];

/** Answers "what will it really cost?" with numbers, not adjectives. */
export function CostTable() {
  return (
    <section className="py-20 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-20">
        <div>
          <SectionHeading eyebrow="What it costs" title="One fee, shown before you apply" />
          <div className="text-muted-foreground mt-6 grid max-w-[34rem] gap-4">
            <p>
              Every loan runs for {loanRules.termMonths} month with a flat {loanRules.feeRate * 100}% fee. There are no
              application fees and no charge for collecting your collateral.
            </p>
            <p>
              <strong className="text-ink">If you pay late,</strong> {loanRules.lateRate * 100}% is added to whatever is still
              outstanding for each missed due date. If you think you&apos;ll struggle, talk to us before the due date.
            </p>
          </div>
        </div>
        <div className="bg-card border-border overflow-x-auto rounded-2xl border">
          <table className="t-tab w-full text-left">
            <caption className="sr-only">Example repayments</caption>
            <thead>
              <tr className="border-border border-b">
                <th scope="col" className="t-meta text-muted-foreground px-4 py-4 font-semibold whitespace-nowrap sm:px-6">You borrow</th>
                <th scope="col" className="t-meta text-muted-foreground px-4 py-4 font-semibold whitespace-nowrap sm:px-6">Fee</th>
                <th scope="col" className="t-meta text-muted-foreground px-4 py-4 text-right font-semibold whitespace-nowrap sm:px-6">You repay</th>
              </tr>
            </thead>
            <tbody>
              {EXAMPLES.map((amount) => {
                const { fee, total } = calculateRepayment(amount);
                return (
                  <tr key={amount} className="border-border border-b last:border-0">
                    <td className="px-4 py-4 font-medium sm:px-6">{formatRand(amount)}</td>
                    <td className="text-muted-foreground px-4 py-4 sm:px-6">{formatRand(fee)}</td>
                    <td className="px-4 py-4 text-right text-lg font-bold sm:px-6">{formatRand(total)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
