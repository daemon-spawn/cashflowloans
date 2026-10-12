import { company, formatRand, loanRules } from "@cashflow/core";

import { Container } from "@/components/shared/Container";

const figures = [
  { figure: "R100k", label: "Borrow up to", detail: `Unsecured to ${formatRand(loanRules.unsecuredMaxAmount)}, secured to ${formatRand(loanRules.securedMaxAmount)}` },
  { figure: "1", unit: "month", label: "One repayment", detail: "A single payment at the end of the term" },
  { figure: "15", unit: "min", label: "Paid out", detail: "Once you approve DebiCheck with your bank" },
  { figure: "R0", label: "Hidden fees", detail: "No application or collateral collection fee" },
];

const assurances = [
  company.ncrNumber ? `NCR registered · ${company.ncrNumber}` : "Registered credit provider",
  "Collateral insured while we hold it",
  "POPIA compliant",
];

/** The offer in four facts, then the trust signals. Only verifiable claims belong here. */
export function Stats() {
  return (
    <section aria-label="The offer at a glance" className="py-20 sm:py-24">
      <Container>
        <dl className="border-border grid grid-cols-2 gap-y-12 border-t pt-12 lg:grid-cols-4">
          {figures.map((f) => (
            <div key={f.label} className="pr-6">
              <dt className="text-muted-foreground text-sm">{f.label}</dt>
              <dd className="mt-3">
                <span className="t-numeral text-brand-950 text-[clamp(3.25rem,2.4rem+3vw,5.25rem)]">{f.figure}</span>
                {f.unit && <span className="t-numeral text-brand-900 ml-1.5 text-[clamp(1.5rem,1.2rem+1vw,2.25rem)]">{f.unit}</span>}
                <p className="text-muted-foreground mt-3 max-w-[16rem] text-[0.9375rem]">{f.detail}</p>
              </dd>
            </div>
          ))}
        </dl>
        <ul className="mt-14 flex flex-wrap gap-2.5">
          {assurances.map((a) => (
            <li key={a} className="border-border bg-card rounded-full border px-4 py-2 text-sm">
              <span aria-hidden className="bg-gold mr-2 inline-block size-1.5 -translate-y-px rounded-full align-middle" />
              {a}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
