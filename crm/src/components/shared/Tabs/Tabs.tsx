import Link from "next/link";
import { cn } from "@cashflow/ui/lib/utils";

/** Link-based tabs: each tab is a URL, so the browser back button and bookmarks just work. */
export function Tabs({ items, active }: { items: { label: string; href: string; value: string; count?: number }[]; active: string }) {
  return (
    <nav aria-label="Filter" className="-mx-1 mb-5 flex gap-1 overflow-x-auto px-1 pb-1">
      {items.map((t) => (
        <Link
          key={t.value}
          href={t.href}
          aria-current={t.value === active ? "page" : undefined}
          className={cn(
            "inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 text-sm whitespace-nowrap",
            t.value === active ? "bg-brand-900 border-brand-900 text-white" : "bg-card hover:bg-muted",
          )}
        >
          {t.label}
          {t.count !== undefined && <span className={cn("text-xs tabular-nums", t.value === active ? "text-white/80" : "text-muted-foreground")}>{t.count}</span>}
        </Link>
      ))}
    </nav>
  );
}
