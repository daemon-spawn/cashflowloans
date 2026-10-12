import { cn } from "@cashflow/ui/lib/utils";

/**
 * Wordmark. The diamond echoes the outline in the original raster logo
 * (legacy/src/assets/images/logo.jpeg). Swap for a vector logo if the owner has one.
 */
export function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 24 24" aria-hidden className="size-6 shrink-0">
        <rect x="4.5" y="4.5" width="15" height="15" rx="1.5" transform="rotate(45 12 12)" fill="none" stroke="var(--marigold)" strokeWidth="2.25" />
        <rect x="9" y="9" width="6" height="6" rx="0.75" transform="rotate(45 12 12)" fill={tone === "dark" ? "var(--brand-900)" : "var(--brand-300)"} />
      </svg>
      <span className={cn("font-display text-[1.0625rem] font-bold tracking-[-0.02em]", tone === "dark" ? "text-ink" : "text-white")}>
        Cashflow Loans
      </span>
    </span>
  );
}
