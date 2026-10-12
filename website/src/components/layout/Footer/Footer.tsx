import Link from "next/link";
import { company, whatsappLink } from "@cashflow/core";
import { Button } from "@cashflow/ui/components/button";

import { Container } from "@/components/shared/Container";
import { Logo } from "@/components/shared/Logo";
import { footerNavigation, primaryCta } from "@/lib/site";

async function CopyrightYear() {
  "use cache";
  return new Date().getFullYear();
}

function FooterColumn({ title, links }: { title: string; links: readonly { label: string; href: string }[] }) {
  return (
    <nav aria-label={title}>
      <p className="t-meta text-brand-300">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="hover:text-white">{item.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export async function Footer() {
  return (
    <footer className="bg-brand-950 mt-auto pb-24 text-white/75 md:pb-0">
      <Container className="grid gap-12 py-16 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div className="grid content-start gap-5">
          <Logo tone="light" />
          <p className="max-w-xs">Secured and unsecured short-term loans for South Africans, from R100 to R100,000.</p>
          <Button asChild className="justify-self-start">
            <Link href={primaryCta.href}>{primaryCta.label}</Link>
          </Button>
        </div>
        <FooterColumn title="Loans" links={footerNavigation.loans} />
        <FooterColumn title="Company" links={footerNavigation.company} />
        <div>
          <p className="t-meta text-brand-300">Talk to us</p>
          <ul className="mt-4 space-y-2.5">
            <li><a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp {company.phoneDisplay}</a></li>
            <li><a href={`tel:${company.phone}`} className="hover:text-white">Call {company.phoneDisplay}</a></li>
            <li><a href={`mailto:${company.email}`} className="hover:text-white">{company.email}</a></li>
            <li className="text-white/60">{company.hours}</li>
          </ul>
        </div>
      </Container>
      <Container>
        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {await CopyrightYear()} {company.legalName}. Registered credit provider
            {company.ncrNumber ? `, NCR reg. no. ${company.ncrNumber}` : ""}.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footerNavigation.legal.map((item) => (
              <li key={item.href}><Link href={item.href} className="hover:text-white">{item.label}</Link></li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
