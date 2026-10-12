import { BadgeCheck, Clock, LockKeyhole, ShieldCheck } from "lucide-react";
import { company } from "@cashflow/core";

import { Container } from "@/components/shared/Container";

const points = [
  {
    icon: BadgeCheck,
    title: "Registered credit provider",
    detail: company.ncrNumber ? `NCR reg. no. ${company.ncrNumber}` : "With the National Credit Regulator",
  },
  { icon: ShieldCheck, title: "Collateral insured", detail: "While we hold it, until you repay" },
  { icon: LockKeyhole, title: "POPIA compliant", detail: "Your documents stay private" },
  { icon: Clock, title: "Paid in 15 minutes", detail: "After you approve DebiCheck" },
];

/** Early proof directly under the hero. Only verifiable claims belong here. */
export function TrustStrip() {
  return (
    <section aria-label="Why you can trust us" className="bg-card border-border border-b">
      <Container>
        <ul className="grid grid-cols-1 gap-x-8 gap-y-5 py-7 sm:grid-cols-2 lg:grid-cols-4">
          {points.map(({ icon: Icon, title, detail }) => (
            <li key={title} className="flex items-start gap-3">
              <Icon className="text-brand-900 mt-0.5 size-5 shrink-0" aria-hidden />
              <div className="leading-snug">
                <p className="font-semibold">{title}</p>
                <p className="text-muted-foreground text-sm">{detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
