import type { FaqItem } from "@/content/faq";

/** Accessible accordion using native <details>. Swap for shadcn Accordion in the redesign if needed. */
export function FaqList({ items }: { items: readonly FaqItem[] }) {
  return (
    <div className="divide-y rounded-2xl border">
      {items.map((item) => (
        <details key={item.question} className="group p-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
            {item.question}
            <span aria-hidden className="text-brand-500 transition-transform group-open:rotate-45">+</span>
          </summary>
          <div className="text-muted-foreground mt-4 space-y-2">
            {item.answer.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
