import Link from "next/link";

import { Container } from "@/components/shared/Container";
import { Logo } from "@/components/shared/Logo";
import { HeaderCta } from "@/components/layout/HeaderCta";
import { MobileNav } from "@/components/layout/MobileNav";
import { navigation } from "@/lib/site";

export function Header() {
  return (
    <header className="bg-mist/90 border-border/70 sticky top-0 z-40 border-b backdrop-blur-md">
      <Container className="relative flex h-16 items-center justify-between gap-6">
        <Link href="/" aria-label="Cashflow Loans home" className="rounded-sm">
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-8 text-[0.9375rem] font-medium">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink/80 hover:text-ink rounded-sm py-2 transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <HeaderCta />
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
