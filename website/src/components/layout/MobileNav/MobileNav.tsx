"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { company, whatsappLink } from "@cashflow/core";
import { Button } from "@cashflow/ui/components/button";

import { navigation, primaryCta } from "@/lib/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  // Close on Escape; links close it on click.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="size-11 text-white hover:bg-white/10 hover:text-white"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <X className="size-6" /> : <Menu className="size-6" />}
      </Button>
      {open && (
        <nav id="mobile-menu" aria-label="Main" data-surface="dark" className="bg-brand-950 absolute inset-x-0 top-full border-b border-white/10 px-4 pt-2 pb-6 text-white shadow-lg">
          <ul className="divide-y divide-white/10">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="t-h3 flex min-h-12 items-center" onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid gap-3">
            <Button asChild size="lg" variant="inverse">
              <Link href={primaryCta.href} onClick={() => setOpen(false)}>{primaryCta.label}</Link>
            </Button>
            <Button asChild size="lg" variant="onDark">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp {company.phoneDisplay}</a>
            </Button>
          </div>
        </nav>
      )}
    </div>
  );
}
