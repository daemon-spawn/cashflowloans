import { cn } from "@cashflow/ui/lib/utils";

import type { LegalDocument } from "@/content/legal/types";

export const legalSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/**
 * The numbered text of a legal document. `compact` is the smaller version shown
 * inside the application form, so applicants can read the terms without leaving it.
 */
export function LegalText({ document, compact = false }: { document: LegalDocument; compact?: boolean }) {
  const SectionHeading = compact ? "h3" : "h2";
  const ClauseHeading = compact ? "h4" : "h3";
  return (
    <div className={cn("text-ink/80", compact ? "text-[0.9375rem] leading-[1.65]" : "max-w-[44rem] text-[1.0625rem] leading-[1.7]")}>
      {document.intro.map((p) => <p key={p} className={compact ? undefined : "t-lead text-ink/80"}>{p}</p>)}
      {document.sections.map((s, i) => (
        <div
          key={s.title}
          id={compact ? undefined : legalSlug(s.title)}
          className={cn("border-border border-t", compact ? "mt-6 pt-5" : "mt-12 scroll-mt-28 pt-10")}
        >
          <SectionHeading className={cn("t-h3 text-ink flex", compact ? "gap-2 text-[1.0625rem]" : "gap-4 text-[1.5rem]")}>
            <span className="t-tab text-brand-700">{i + 1}.</span>
            {s.title}
          </SectionHeading>
          <div className={cn("grid", compact ? "mt-3 gap-4" : "mt-6 gap-6")}>
            {s.clauses.map((c, j) => (
              <div
                key={j}
                className={s.clauses.length > 1 ? cn("grid gap-x-2", compact ? "grid-cols-[2rem_minmax(0,1fr)]" : "grid-cols-[2.25rem_minmax(0,1fr)] sm:grid-cols-[3rem_minmax(0,1fr)]") : undefined}
              >
                {s.clauses.length > 1 && <span className="t-tab text-muted-foreground pt-px text-[0.875rem]">{i + 1}.{j + 1}</span>}
                <div className={cn("grid", compact ? "gap-1" : "gap-2")}>
                  {c.heading && <ClauseHeading className="text-ink font-medium">{c.heading}</ClauseHeading>}
                  {c.text && <p>{c.text}</p>}
                  {c.list && (
                    <ul className={cn("marker:text-brand-700 grid list-disc pl-5", compact ? "gap-1" : "gap-2")}>
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
        <p key={p} className={cn("bg-sage text-brand-950 font-medium", compact ? "mt-6 rounded-xl p-4" : "mt-12 rounded-[1.25rem] p-6")}>{p}</p>
      ))}
    </div>
  );
}
