import Image from "next/image";
import Link from "next/link";

import { NavLinks } from "./NavLinks";
import type { NavCounts } from "./nav";

export function Sidebar({ counts }: { counts: NavCounts }) {
  return (
    // The outer column paints the full page height; the inner one stays in view while scrolling.
    <div data-surface="dark" className="bg-brand-950 hidden w-64 shrink-0 md:block">
    <aside className="sticky top-0 flex h-screen flex-col text-white">
      <Link href="/" className="block px-5 pt-6 pb-8" aria-label="Cashflow CRM home">
        <Image src="/logo-horizontal.png" alt="Cashflow Loans" width={1139} height={200} priority className="h-8 w-auto" />
        <span className="text-gold mt-2 block text-[0.6875rem] font-semibold tracking-[0.18em] uppercase">CRM</span>
      </Link>
      <nav aria-label="CRM" className="flex-1 overflow-y-auto px-3">
        <NavLinks counts={counts} />
      </nav>
    </aside>
    </div>
  );
}
