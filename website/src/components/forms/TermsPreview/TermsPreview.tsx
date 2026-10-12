import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { LegalText } from "@/components/shared/LegalDocument";
import { terms } from "@/content/legal/terms";

/** The full Terms and Conditions in a scrollable panel, so applicants can read them before accepting. */
export function TermsPreview() {
  return (
    <section aria-labelledby="terms-preview-title" className="border-border overflow-hidden rounded-[1.25rem] border">
      <div className="bg-sage/60 flex items-center justify-between gap-4 px-5 py-3.5">
        <h2 id="terms-preview-title" className="font-medium whitespace-nowrap">Terms and Conditions</h2>
        <Link href="/legal/terms" target="_blank" className="text-brand-900 inline-flex shrink-0 items-center gap-1 text-sm font-medium whitespace-nowrap underline-offset-4 hover:underline">
          Open full page <ArrowUpRight className="size-3.5" aria-hidden />
        </Link>
      </div>
      {/* data-lenis-prevent lets the panel scroll natively instead of moving the page. */}
      <div
        tabIndex={0}
        role="region"
        aria-label="Terms and Conditions text, scrollable"
        data-lenis-prevent
        className="max-h-72 overflow-y-auto overscroll-contain px-5 py-5 focus-visible:outline-offset-[-2px] sm:max-h-80"
      >
        <LegalText document={terms} compact />
      </div>
    </section>
  );
}
