import { cn } from "@cashflow/ui/lib/utils";

/** Second tone in a two-tone headline: money green on light surfaces, sage on dark. */
export function Highlight({ children, tone = "light", className }: { children: React.ReactNode; tone?: "light" | "dark"; className?: string }) {
  return <span className={cn(tone === "light" ? "text-brand-900" : "text-sage", className)}>{children}</span>;
}
