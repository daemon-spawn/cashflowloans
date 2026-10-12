import { Fragment } from "react";

import type { BlogBlock } from "@/content/blog";

/** Renders **bold** spans; the migrated articles use no other inline formatting. */
function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") ? <strong key={i} className="text-ink font-semibold">{part.slice(2, -2)}</strong> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  );
}

export function BlogBody({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="text-ink/85 grid gap-5 text-[1.125rem] leading-[1.7]">
      {blocks.map((b, i) => {
        if (b.type === "heading") return <h2 key={i} className="t-h3 text-ink mt-6 text-[1.5rem]">{b.text}</h2>;
        if (b.type === "paragraph") return <p key={i}><Inline text={b.text} /></p>;
        const List = b.ordered ? "ol" : "ul";
        return (
          <List key={i} className={b.ordered ? "grid list-decimal gap-2 pl-6" : "grid list-disc gap-2 pl-6 marker:text-brand-700"}>
            {b.items.map((item) => <li key={item} className="pl-1"><Inline text={item} /></li>)}
          </List>
        );
      })}
    </div>
  );
}
