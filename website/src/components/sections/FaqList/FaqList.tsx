import { Fragment } from "react";
import { Plus } from "lucide-react";

import type { FaqItem } from "@/content/faq";

/** Renders **bold** spans used in the original FAQ copy. */
function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") ? <strong key={i} className="text-ink font-semibold">{part.slice(2, -2)}</strong> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  );
}

/** Native <details> accordion: keyboard and screen-reader friendly with no JS. */
export function FaqList({ items }: { items: readonly FaqItem[] }) {
  return (
    <div className="border-border divide-border divide-y border-y">
      {items.map((item) => (
        <details key={item.question} className="group">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-6 text-[1.125rem] font-medium [&::-webkit-details-marker]:hidden">
            {item.question}
            <Plus aria-hidden className="text-brand-900 size-5 shrink-0 transition-transform group-open:rotate-45 motion-reduce:transition-none" />
          </summary>
          <div className="text-muted-foreground max-w-[62ch] pb-6">
            {item.list ? (
              <ul className="marker:text-brand-700 grid list-disc gap-2 pl-5">
                {item.answer.map((line) => <li key={line}><Inline text={line} /></li>)}
              </ul>
            ) : (
              <div className="grid gap-3">
                {item.answer.map((line) => <p key={line}><Inline text={line} /></p>)}
              </div>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
