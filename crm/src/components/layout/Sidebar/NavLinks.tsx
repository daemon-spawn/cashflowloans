"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@cashflow/ui/lib/utils";

import { sidebarNav, type NavCounts } from "./nav";

export function NavLinks({ counts, onNavigate }: { counts: NavCounts; onNavigate?: () => void }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <ul className="space-y-1">
      {sidebarNav.map((item) => {
        const Icon = item.icon;
        const count = "count" in item ? counts[item.count] : undefined;
        const active = isActive(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/75 transition-colors hover:bg-white/10 hover:text-white",
                active && "bg-white/10 font-medium text-white",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              <span className="flex-1">{item.label}</span>
              {count ? (
                <span className="bg-gold text-brand-950 min-w-5 rounded-full px-1.5 text-center text-xs leading-5 font-semibold">
                  {count}
                  <span className="sr-only"> need attention</span>
                </span>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
