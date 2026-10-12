import Image from "next/image";
import Link from "next/link";
import { company, whatsappLink } from "@cashflow/core";
import { Button } from "@cashflow/ui/components/button";

import { Container } from "@/components/shared/Container";
import { primaryCta } from "@/lib/site";
import celebrating from "@public/images/customer-celebrating-with-notes.jpeg";

/**
 * Closing call to action. The photo has a pure white background, so the white
 * panel and the image read as one surface.
 */
export function FinalCta() {
  return (
    <section className="pb-20 sm:pb-28">
      <Container>
        <div className="text-brand-950 border-border grid overflow-hidden rounded-2xl border bg-white md:grid-cols-2">
          <div className="flex flex-col justify-center px-7 py-12 sm:px-12 lg:py-16">
            <h2 className="t-h2 max-w-[18ch]">See what you&apos;ll repay, then apply in about 5 minutes</h2>
            <p className="text-muted-foreground mt-4 max-w-[40ch]">Prefer to talk first? Our team answers on WhatsApp, Monday to Saturday.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={primaryCta.href}>{primaryCta.label}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp {company.phoneDisplay}</a>
              </Button>
            </div>
          </div>
          <div className="relative min-h-[20rem] md:min-h-full">
            <Image src={celebrating} alt="A delighted customer holding Rand notes" fill placeholder="blur" sizes="(min-width: 768px) 45vw, 100vw" className="object-contain object-bottom md:object-cover md:object-[center_35%]" />
          </div>
        </div>
      </Container>
    </section>
  );
}
