import Link from "next/link";
import { cn } from "@cashflow/ui/lib/utils";

export function Stat({
  label,
  value,
  hint,
  href,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  href?: string;
  tone?: "default" | "alert" | "dark";
}) {
  const body = (
    <>
      <p className={cn("text-sm", tone === "dark" ? "text-white/70" : "text-muted-foreground")}>{label}</p>
      <p className={cn("mt-1.5 text-2xl font-semibold tracking-tight tabular-nums", tone === "alert" && "text-destructive")}>{value}</p>
      {hint && <p className={cn("mt-1 text-xs", tone === "dark" ? "text-white/60" : "text-muted-foreground")}>{hint}</p>}
    </>
  );
  const classes = cn(
    "block rounded-xl border p-5",
    tone === "dark" ? "bg-brand-950 border-brand-950 text-white" : "bg-card",
    href && "hover:border-brand-900/40 transition-colors",
  );
  return href ? (
    <Link href={href} className={classes} {...(tone === "dark" ? { "data-surface": "dark" } : {})}>
      {body}
    </Link>
  ) : (
    <div className={classes} {...(tone === "dark" ? { "data-surface": "dark" } : {})}>{body}</div>
  );
}
