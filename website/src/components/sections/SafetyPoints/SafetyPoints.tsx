import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

const points = [
  {
    title: "Your collateral",
    body: "Everything we hold is insured and stored securely for the whole loan period. You get it back as soon as the loan is repaid.",
  },
  {
    title: "Your bank account",
    body: "DebiCheck means no debit order runs until you have approved it with your own bank. You stay in control of what leaves your account.",
  },
  {
    title: "Your information",
    body: "We handle your ID, payslips and statements under POPIA. Documents are stored privately and only our team can open them.",
  },
];

/** Objection handling: "is my stuff and my data safe?" */
export function SafetyPoints() {
  return (
    <section data-surface="dark" className="bg-brand-950 py-20 text-white sm:py-28">
      <Container>
        <SectionHeading tone="light" eyebrow="Peace of mind" title="Safe with us, from first message to final payment" />
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-3">
          {points.map((p) => (
            <div key={p.title} className="bg-brand-950 p-7 sm:p-8">
              <h3 className="t-h3 text-gold">{p.title}</h3>
              <p className="mt-3 text-white/80">{p.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
