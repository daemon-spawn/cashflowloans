"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@cashflow/ui/components/button";

import { primaryCta } from "@/lib/site";

/** Hidden on /apply so the form page has no competing action. */
export function HeaderCta() {
  const pathname = usePathname();
  if (pathname.startsWith(primaryCta.href)) return null;

  return (
    <Button asChild className="hidden sm:inline-flex">
      <Link href={primaryCta.href}>{primaryCta.label}</Link>
    </Button>
  );
}
