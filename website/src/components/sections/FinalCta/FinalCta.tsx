import Image from "next/image";
import Link from "next/link";
import { company, whatsappLink } from "@cashflow/core";
import { Button } from "@cashflow/ui/components/button";

import { Container } from "@/components/shared/Container";
import { Highlight } from "@/components/shared/Highlight";
import { primaryCta } from "@/lib/site";
import noteHeldUp from "@public/images/r100-note-held-up.jpeg";

/** Closing statement on a deep-green panel that matches the photo's dark background. */
export function FinalCta() {
  return (
    <section className="pb-20 sm:pb-28">
      <Container>
        <div data-surface="dark" className="bg-brand-950 grid overflow-hidden rounded-[2rem] text-white lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-16">
            <h2 className="t-h2">
              See what you&apos;ll repay, then apply <Highlight tone="dark">in about 5 minutes.</Highlight>
            </h2>
            <p className="mt-6 max-w-[38ch] text-white/70">Prefer to talk first? Our team answers on WhatsApp, Monday to Saturday.</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="inverse">
                <Link href={primaryCta.href}>{primaryCta.label}</Link>
              </Button>
              <Button asChild size="lg" variant="onDark">
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp {company.phoneDisplay}</a>
              </Button>
            </div>
          </div>
          <div className="relative min-h-[18rem] lg:min-h-full">
            <Image src={noteHeldUp} alt="A R100 note held up to the camera" fill placeholder="blur" sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </div>
        </div>
      </Container>
    </section>
  );
}
