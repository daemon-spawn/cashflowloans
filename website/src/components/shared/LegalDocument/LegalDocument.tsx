import { Container } from "@/components/shared/Container";
import type { LegalDocument as LegalDocumentData } from "@/content/legal/types";

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

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
                <a href={`#${slug(s.title)}`} className="text-ink/70 hover:text-brand-900 flex gap-3 rounded-sm py-1.5">
                  <span className="t-tab text-brand-700 w-5">{i + 1}.</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="bg-card rounded-[2rem] p-6 sm:p-12 lg:max-w-[52rem]">
          <div className="text-ink/80 max-w-[44rem] text-[1.0625rem] leading-[1.7]">
            {document.intro.map((p) => <p key={p} className="t-lead text-ink/80">{p}</p>)}
            {document.sections.map((s, i) => (
              <div key={s.title} id={slug(s.title)} className="border-border mt-12 scroll-mt-28 border-t pt-10">
                <h2 className="t-h3 text-ink flex gap-4 text-[1.5rem]">
                  <span className="t-tab text-brand-700">{i + 1}.</span>
                  {s.title}
                </h2>
                <div className="mt-6 grid gap-6">
                  {s.clauses.map((c, j) => (
                    <div key={j} className={s.clauses.length > 1 ? "grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-2 sm:grid-cols-[3rem_minmax(0,1fr)]" : undefined}>
                      {s.clauses.length > 1 && <span className="t-tab text-muted-foreground pt-px text-[0.9375rem]">{i + 1}.{j + 1}</span>}
                      <div className="grid gap-2">
                        {c.heading && <h3 className="text-ink font-medium">{c.heading}</h3>}
                        {c.text && <p>{c.text}</p>}
                        {c.list && (
                          <ul className="marker:text-brand-700 grid list-disc gap-2 pl-5">
                            {c.list.map((item) => <li key={item}>{item}</li>)}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {document.closing?.map((p) => (
              <p key={p} className="bg-sage text-brand-950 mt-12 rounded-[1.25rem] p-6 font-medium">{p}</p>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
