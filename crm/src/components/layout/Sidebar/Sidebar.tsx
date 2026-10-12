"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@cashflow/ui/lib/utils";

import { sidebarNav } from "./nav";

export function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <aside className="bg-brand-950 hidden w-60 shrink-0 flex-col text-white/80 md:flex">
      <div className="px-6 py-5 text-lg font-bold text-white">Cashflow CRM</div>
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {sidebarNav.map(({ label, href, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-white/10 hover:text-white",
                  isActive(href) && "bg-white/10 text-white",
                )}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
