import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@cashflow/ui/lib/utils";

type PillProps = {
  children: React.ReactNode;
  /** Renders as a link with an arrow when set. */
  href?: string;
  tone?: "light" | "dark";
  className?: string;
};

/** Rounded section label. With `href` it doubles as a small navigational link. */
export function Pill({ children, href, tone = "light", className }: PillProps) {
  const classes = cn(
    "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.8125rem] font-medium leading-none",
    tone === "light" ? "bg-brand-900 text-white" : "bg-sage text-brand-950",
    href && "transition-colors hover:bg-brand-700",
    href && tone === "dark" && "hover:bg-white",
    className,
  );

  if (!href) return <span className={classes}>{children}</span>;
  return (
    <Link href={href} className={classes}>
      {children}
      <ArrowRight className="size-3.5" aria-hidden />
    </Link>
  );
}
