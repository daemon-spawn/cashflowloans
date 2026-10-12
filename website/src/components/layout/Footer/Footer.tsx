import Link from "next/link";
import { company } from "@cashflow/core";

import { Container } from "@/components/shared/Container";
import { legalLinks, navigation } from "@/lib/site";

async function CopyrightYear() {
  "use cache";
  return new Date().getFullYear();
}

export async function Footer() {
  return (
    <footer className="bg-brand-950 mt-auto text-white/80">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-bold text-white">{company.name}</p>
          <p className="mt-3 text-sm">
            Registered credit provider{company.ncrNumber ? ` · ${company.ncrNumber}` : ""}
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="font-semibold text-white">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            {navigation.map((item) => (
              <li key={item.href}><Link href={item.href} className="hover:text-white">{item.label}</Link></li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="font-semibold text-white">Contact</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href={`tel:${company.phone}`} className="hover:text-white">{company.phoneDisplay}</a></li>
            <li><a href={`mailto:${company.email}`} className="hover:text-white">{company.email}</a></li>
            <li>{company.hours}</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Legal</p>
          <ul className="mt-3 space-y-2 text-sm">
            {legalLinks.map((item) => (
              <li key={item.href}><Link href={item.href} className="hover:text-white">{item.label}</Link></li>
            ))}
          </ul>
        </div>
      </Container>
      <Container className="border-t border-white/10 py-6 text-xs">
        © {await CopyrightYear()} {company.legalName}. All rights reserved.
      </Container>
    </footer>
  );
}
