import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Hero } from "@/components/sections/Hero";
import { LoanCalculator } from "@/components/sections/LoanCalculator";
import { FaqList } from "@/components/sections/FaqList";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Reveal } from "@/components/motion/Reveal";
import { faq } from "@/content/faq";

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="py-20">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              eyebrow="Loan calculator"
              title="See exactly what you'll repay"
              description="One month, one flat fee. No hidden costs."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <LoanCalculator />
          </Reveal>
        </Container>
      </section>
      <section className="py-20">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Questions, answered" align="center" className="mb-10" />
          <FaqList items={faq.slice(0, 5)} />
        </Container>
      </section>
      <CtaBanner />
    </>
  );
}
