import Link from "next/link";
import { whatsappLink } from "@cashflow/core";
import { Button } from "@cashflow/ui/components/button";

import { Container } from "@/components/shared/Container";

export function CtaBanner({ title = "Ready when you are." }: { title?: string }) {
  return (
    <section className="py-20">
      <Container>
        <div className="bg-brand-900 flex flex-col items-start justify-between gap-6 rounded-3xl p-10 text-white sm:flex-row sm:items-center">
          <h2 className="text-3xl font-semibold">{title}</h2>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-white text-brand-900 hover:bg-white/90">
              <Link href="/apply">Apply now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp us</a>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
