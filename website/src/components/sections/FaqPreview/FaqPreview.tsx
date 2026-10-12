import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FaqList } from "@/components/sections/FaqList";
import type { FaqItem } from "@/content/faq";

export function FaqPreview({ items }: { items: readonly FaqItem[] }) {
  return (
    <section className="py-20 sm:py-28">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div>
          <SectionHeading eyebrow="Questions" title="Answers before you apply" />
          <Link href="/faq" className="text-brand-900 group mt-6 inline-flex items-center gap-2 font-semibold underline-offset-4 hover:underline">
            See all questions
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
        <FaqList items={items} />
      </Container>
    </section>
  );
}
