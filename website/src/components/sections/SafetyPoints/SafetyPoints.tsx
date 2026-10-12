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
    <section className="pb-20 sm:pb-28">
      <Container>
        <div data-surface="dark" className="bg-brand-950 rounded-[2rem] p-6 text-white sm:p-10 lg:p-14">
          <SectionHeading tone="light" eyebrow="Peace of mind" title="Safe with us," highlight="from first message to final payment" />
          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {points.map((p) => (
              <div key={p.title} className="border-t border-white/15 pt-6">
                <h3 className="t-h3 text-sage">{p.title}</h3>
                <p className="mt-3 text-white/70">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
