import Link from "next/link";
import { company, whatsappLink } from "@cashflow/core";
import { Button } from "@cashflow/ui/components/button";

import { Container } from "@/components/shared/Container";
import { primaryCta } from "@/lib/site";

type Props = { title?: string; description?: string };

export function CtaBanner({
  title = "See what you'll repay, then apply in about 5 minutes",
  description = "Prefer to talk first? Our team answers on WhatsApp, Monday to Saturday.",
}: Props) {
  return (
    <section className="pb-20 sm:pb-28">
      <Container>
        <div className="bg-brand-900 grid gap-8 rounded-3xl px-7 py-12 text-white sm:px-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:py-14">
          <div>
            <h2 className="t-h2 max-w-[22ch]">{title}</h2>
            <p className="mt-4 max-w-[46ch] text-white/75">{description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </Button>
            <Button asChild size="lg" variant="onDark">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp {company.phoneDisplay}</a>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
