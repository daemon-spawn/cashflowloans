import { Container } from "@/components/shared/Container";
import { LegalText, legalSlug } from "@/components/shared/LegalDocument/LegalText";
import type { LegalDocument as LegalDocumentData } from "@/content/legal/types";

/** Numbered legal text with a sticky contents list on large screens. */
export function LegalDocument({ document }: { document: LegalDocumentData }) {
  return (
    <section className="py-14 sm:py-20">
      <Container className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
        <nav aria-label="Contents" className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
          <p className="t-meta text-muted-foreground">Contents</p>
          <ol className="mt-4 grid gap-1 text-[0.9375rem]">
            {document.sections.map((s, i) => (
              <li key={s.title}>
                <a href={`#${legalSlug(s.title)}`} className="text-ink/70 hover:text-brand-900 flex gap-3 rounded-sm py-1.5">
                  <span className="t-tab text-brand-700 w-5">{i + 1}.</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="bg-card rounded-[2rem] p-6 sm:p-12 lg:max-w-[52rem]">
          <LegalText document={document} />
        </div>
      </Container>
    </section>
  );
}
