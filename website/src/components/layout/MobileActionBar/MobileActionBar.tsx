"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@cashflow/core";
import { Button } from "@cashflow/ui/components/button";

import { primaryCta } from "@/lib/site";

/** Thumb-zone actions on phones (design brief CTA map: mobile sticky bar). */
export function MobileActionBar() {
  const onApply = usePathname().startsWith(primaryCta.href);

  return (
    <div className="bg-ivory/95 border-border fixed inset-x-0 bottom-0 z-40 border-t px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur-md md:hidden">
      <div className="flex gap-3">
        {!onApply && (
          <Button asChild size="lg" className="flex-1">
            <Link href={primaryCta.href}>Apply now</Link>
          </Button>
        )}
        <Button asChild size="lg" variant="outline" className={onApply ? "flex-1" : undefined}>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
            <MessageCircle className="size-5" aria-hidden />
            WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}
