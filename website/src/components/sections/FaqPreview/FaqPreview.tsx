import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FaqList } from "@/components/sections/FaqList";
import type { FaqItem } from "@/content/faq";

/** Homepage FAQ: every question, with the original site's headings. */
export function FaqPreview({ items }: { items: readonly FaqItem[] }) {
  return (
    <section className="pb-20 sm:pb-28">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading eyebrow="Frequently Asked Questions" title="Have Any" highlight="Questions?" />
        </div>
        <FaqList items={items} />
      </Container>
    </section>
  );
}
