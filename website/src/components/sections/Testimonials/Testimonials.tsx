import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import type { Testimonial } from "@/content/testimonials";

/** Renders nothing until real, consented testimonials exist. */
export function Testimonials({ items }: { items: readonly Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Customers" title="What people say after borrowing with us" />
        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <li key={t.name + t.quote.slice(0, 20)}>
              <figure className="bg-card border-border flex h-full flex-col justify-between gap-6 rounded-2xl border p-7">
                <blockquote className="t-lead">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="text-muted-foreground text-sm">
                  <span className="text-ink font-semibold">{t.name}</span>
                  {t.location && `, ${t.location}`}
                  {t.loanType && ` · ${t.loanType} loan`}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
