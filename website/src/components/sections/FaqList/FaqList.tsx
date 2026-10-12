import { Plus } from "lucide-react";

import type { FaqItem } from "@/content/faq";

/** Native <details> accordion: keyboard and screen-reader friendly with no JS. */
export function FaqList({ items }: { items: readonly FaqItem[] }) {
  return (
    <div className="border-border divide-border divide-y border-y">
      {items.map((item) => (
        <details key={item.question} className="group">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-5 text-[1.0625rem] font-semibold [&::-webkit-details-marker]:hidden">
            {item.question}
            <Plus aria-hidden className="text-brand-900 size-5 shrink-0 transition-transform group-open:rotate-45 motion-reduce:transition-none" />
          </summary>
          <div className="text-muted-foreground grid max-w-[62ch] gap-3 pb-6">
            {item.answer.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
