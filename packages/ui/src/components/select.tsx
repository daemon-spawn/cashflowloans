import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@cashflow/ui/lib/utils";

/** Native select: works with FormData, the keyboard and phone pickers out of the box. */
function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <div className={cn("relative", className)}>
      <select
        data-slot="select"
        className={cn(
          "border-input flex h-10 w-full appearance-none rounded-md border bg-transparent py-1 pr-9 pl-3 text-base shadow-xs outline-none md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50",
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown aria-hidden className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
    </div>
  );
}

export { Select };
