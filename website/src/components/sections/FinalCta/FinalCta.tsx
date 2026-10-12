import Image from "next/image";
import Link from "next/link";
import { company, whatsappLink } from "@cashflow/core";
import { Button } from "@cashflow/ui/components/button";

import { Container } from "@/components/shared/Container";
import { primaryCta } from "@/lib/site";
import noteHeldUp from "@public/images/r100-note-held-up.jpeg";

/** Closing call to action on a dark panel that matches the photo's dark background. */
export function FinalCta() {
  return (
    <section className="pb-20 sm:pb-28">
      <Container>
        <div className="bg-brand-950 grid overflow-hidden rounded-2xl text-white md:grid-cols-2">
          <div className="flex flex-col justify-center px-7 py-12 sm:px-12 lg:py-16">
            <h2 className="t-h2 max-w-[18ch]">See what you&apos;ll repay, then apply in about 5 minutes</h2>
            <p className="mt-4 max-w-[40ch] text-white/75">Prefer to talk first? Our team answers on WhatsApp, Monday to Saturday.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={primaryCta.href}>{primaryCta.label}</Link>
              </Button>
              <Button asChild size="lg" variant="onDark">
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp {company.phoneDisplay}</a>
              </Button>
            </div>
          </div>
          <div className="relative min-h-[20rem] md:min-h-full">
            <Image src={noteHeldUp} alt="A R100 note held up to the camera" fill placeholder="blur" sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
          </div>
        </div>
      </Container>
    </section>
  );
}
