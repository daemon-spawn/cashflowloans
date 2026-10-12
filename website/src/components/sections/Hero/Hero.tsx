import Link from "next/link";
import { Button } from "@cashflow/ui/components/button";

import { Container } from "@/components/shared/Container";

export function Hero() {
  return (
    <section className="bg-brand-900 relative overflow-hidden text-white">
      <Container className="py-24 sm:py-32">
        <p className="text-brand-300 text-sm font-semibold uppercase tracking-widest">Secured & unsecured loans</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold sm:text-6xl">
          Cash when you need it — without the bank runaround.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-white/80">
          Borrow R100 to R100,000 for one month. Clear costs up front, fast decisions, and funds in your account quickly.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild size="lg" className="bg-white text-brand-900 hover:bg-white/90">
            <Link href="/apply">Apply now</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
            <Link href="/how-it-works">How it works</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
