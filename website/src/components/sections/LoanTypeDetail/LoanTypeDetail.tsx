import Image, { type StaticImageData } from "next/image";

import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { StepList, type Step } from "@/components/sections/StepList";
import { FaqList } from "@/components/sections/FaqList";
import type { FaqItem } from "@/content/faq";

type Fact = { label: string; value: string };

type Props = {
  facts: readonly Fact[];
  steps: readonly Step[];
  stepsImage: StaticImageData;
  stepsImageAlt: string;
  /** What to have ready, shown as a white checklist panel. */
  needs: readonly string[];
  needsNote?: string;
  faqs: readonly FaqItem[];
};

/** Body shared by the secured and unsecured pages: key facts, steps, checklist, related questions. */
export function LoanTypeDetail({ facts, steps, stepsImage, stepsImageAlt, needs, needsNote, faqs }: Props) {
  return (
    <>
      <section className="py-14 sm:py-20">
        <Container>
          <dl className="bg-border grid gap-px overflow-hidden rounded-[2rem] sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="bg-card p-7 sm:p-9">
                <dt className="text-muted-foreground text-[0.9375rem]">{f.label}</dt>
                <dd className="t-numeral text-brand-950 mt-3 text-[clamp(1.875rem,1.5rem+1.2vw,2.5rem)]">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="bg-sage py-20 sm:py-28">
        <Container className="grid gap-14 lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <SectionHeading eyebrow="Step by step" title="From application to" highlight="money in your account" />
              <div className="relative mt-10 aspect-[3/2] overflow-hidden rounded-[1.5rem]">
                <Image src={stepsImage} alt={stepsImageAlt} fill placeholder="blur" sizes="(min-width: 1024px) 38vw, 100vw" className="object-cover" />
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <StepList steps={steps} />
            <p className="text-ink/60 border-brand-900/15 border-t pt-6 text-[0.9375rem]">You can also apply on WhatsApp or by phone. The steps are the same.</p>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <div>
            <SectionHeading eyebrow="Before you apply" title="What to" highlight="have ready" />
            {needsNote && <p className="text-muted-foreground mt-6 max-w-[34ch]">{needsNote}</p>}
          </div>
          <ul className="bg-card rounded-[2rem] px-7 py-3 sm:px-10">
            {needs.map((n, i) => (
              <li key={n} className="border-border flex items-baseline gap-5 border-b py-5 text-[1.0625rem] last:border-b-0">
                <span className="t-tab text-brand-700 w-6 shrink-0 text-sm font-medium">{String(i + 1).padStart(2, "0")}</span>
                {n}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {faqs.length > 0 && (
        <section className="pb-20 sm:pb-28">
          <Container className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading eyebrow="Frequently Asked Questions" eyebrowHref="/faq" title="Have Any" highlight="Questions?" />
            </div>
            <FaqList items={faqs} />
          </Container>
        </section>
      )}
    </>
  );
}
