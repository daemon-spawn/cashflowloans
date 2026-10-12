import Link from "next/link";
import { company } from "@cashflow/core";
import { Button } from "@cashflow/ui/components/button";

import { Container } from "@/components/shared/Container";
import { MobileNav } from "@/components/layout/MobileNav";
import { navigation } from "@/lib/site";

export function Header() {
  return (
    <header className="bg-background/90 sticky top-0 z-40 border-b backdrop-blur">
      <Container className="relative flex h-16 items-center justify-between gap-6">
        <Link href="/" className="text-brand-900 text-lg font-bold">
          {company.name}
        </Link>
        <nav className="hidden lg:block">
          <ul className="flex items-center gap-6 text-sm font-medium">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-brand-500 transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild className="hidden sm:inline-flex">
            <Link href="/apply">Apply now</Link>
          </Button>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
