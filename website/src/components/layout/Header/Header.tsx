import Link from "next/link";

import { Container } from "@/components/shared/Container";
import { Logo } from "@/components/shared/Logo";
import { HeaderCta } from "@/components/layout/HeaderCta";
import { MobileNav } from "@/components/layout/MobileNav";
import { navigation } from "@/lib/site";

/** Dark header so the logo sits on the ground it was designed for. */
export function Header() {
  return (
    <header className="bg-brand-950 sticky top-0 z-40 border-b border-white/10 text-white">
      <Container className="relative flex h-20 items-center justify-between gap-6">
        <Link href="/" aria-label="Cashflow Loans home" className="rounded-md">
          <Logo height={44} priority className="w-[13.5rem] sm:w-[15.5rem]" />
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-9 text-[0.9375rem] font-medium">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="rounded-sm py-2 text-white/80 transition-colors hover:text-white">
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
