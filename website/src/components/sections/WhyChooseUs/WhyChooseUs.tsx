import Image from "next/image";
import Link from "next/link";
import { Button } from "@cashflow/ui/components/button";

import { Container } from "@/components/shared/Container";
import { primaryCta } from "@/lib/site";
import celebrating from "@public/images/customer-celebrating-with-notes.jpeg";

/** "Our Benefits / Why Choose Us?" from the original homepage, copy and photo unchanged. */
export function WhyChooseUs() {
  return (
    <section className="bg-white">
      <Container className="grid items-center gap-10 py-20 sm:py-24 lg:grid-cols-2 lg:gap-16">
        {/* The photo has a pure white background, so it sits directly on the white section. */}
        <div className="relative order-last aspect-[4/3] lg:order-first">
          <Image src={celebrating} alt="A delighted customer holding Rand notes" fill placeholder="blur" sizes="(min-width: 1024px) 45vw, 100vw" className="object-contain" />
        </div>
        <div>
          <p className="t-meta text-brand-700">Our Benefits</p>
          <h2 className="t-h2 mt-3">Why Choose Us?</h2>
          <p className="t-lead text-ink/80 mt-6">
            Select Cashflow Loans for customized financial solutions designed for your unique journey. We offer secured and
            unsecured personal loans, utilizing flexible collateral like mobile devices or vehicle titles to ensure accessibility.
            With swift, dependable service and unwavering integrity, we empower everyone to achieve financial stability and
            freedom, supporting your aspirations with trust and confidence, regardless of your background.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href={primaryCta.href}>{primaryCta.label}</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
