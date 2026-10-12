import { company } from "@cashflow/core";

import { Container } from "@/components/shared/Container";

const points = [
  {
    title: "Registered credit provider",
    detail: company.ncrNumber ? `NCR reg. no. ${company.ncrNumber}` : "With the National Credit Regulator",
  },
  { title: "Collateral insured", detail: "For as long as we hold it" },
  { title: "POPIA compliant", detail: "Your documents stay private" },
  { title: "Paid in 15 minutes", detail: "Once you approve DebiCheck" },
];

/** Early proof under the hero. Only verifiable claims belong here. */
export function TrustStrip() {
  return (
    <section aria-label="Why you can trust us" className="bg-card border-border border-b">
      <Container>
        <ul className="divide-border grid grid-cols-2 lg:grid-cols-4 lg:divide-x">
          {points.map((p) => (
            <li key={p.title} className="py-6 pr-4 lg:px-8 lg:first:pl-0">
              <p className="font-display text-[1.0625rem] font-semibold leading-snug">{p.title}</p>
              <p className="text-muted-foreground mt-1 text-sm">{p.detail}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
