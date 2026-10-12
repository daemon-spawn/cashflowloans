"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@cashflow/ui/components/button";

import { navigation } from "@/lib/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Button variant="ghost" size="icon" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {open ? <X /> : <Menu />}
      </Button>
      {open && (
        <nav className="bg-background absolute inset-x-0 top-full border-b px-4 pb-6 shadow-lg">
          <ul className="flex flex-col gap-1 pt-2">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:bg-accent block rounded-md px-3 py-2" onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button asChild className="mt-4 w-full" size="lg">
            <Link href="/apply" onClick={() => setOpen(false)}>Apply now</Link>
          </Button>
        </nav>
      )}
    </div>
  );
}
