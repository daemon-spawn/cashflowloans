import Image from "next/image";

import { cn } from "@cashflow/ui/lib/utils";

/**
 * The business's own logo (public/images/logo.jpeg), shown whole as a badge
 * like the original site did. Don't redraw or crop it.
 */
export function Logo({ size = 52, priority = false, className }: { size?: number; priority?: boolean; className?: string }) {
  return (
    <Image
      src="/images/logo.jpeg"
      alt="Cashflow Loans"
      width={size}
      height={size}
      priority={priority}
      className={cn("rounded-[18%] ring-1 ring-white/15", className)}
    />
  );
}
