import Image from "next/image";

import { cn } from "@cashflow/ui/lib/utils";
import horizontal from "@public/images/logo-horizontal.png";
import full from "@public/images/logo-full.png";

/**
 * The business's own logo artwork, taken from public/images/logo.jpeg with its
 * dark square removed. "horizontal" places the icon beside the wordmark so the
 * name is legible at header size; "full" is the original stacked lockup with
 * tagline. Both are white-on-transparent, so use them on dark backgrounds.
 */
export function Logo({
  variant = "horizontal",
  height = 44,
  priority = false,
  className,
}: {
  variant?: "horizontal" | "full";
  height?: number;
  priority?: boolean;
  className?: string;
}) {
  const src = variant === "full" ? full : horizontal;
  return (
    <Image
      src={src}
      alt="Cashflow Loans"
      height={height}
      width={Math.round((src.width / src.height) * height)}
      priority={priority}
      className={cn("h-auto max-w-full", className)}
    />
  );
}
