import Image from "next/image";
import Link from "next/link";
import { Button } from "@cashflow/ui/components/button";

import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { primaryCta } from "@/lib/site";
import celebrating from "@public/images/customer-celebrating-with-notes.jpeg";

/** "Our Benefits / Why Choose Us?" from the original homepage, copy and photo unchanged. */
export function WhyChooseUs() {
  return (
    <section className="pb-20 sm:pb-28">
      <Container>
        <div className="grid items-center gap-10 overflow-hidden rounded-[2rem] bg-white p-6 sm:p-10 lg:grid-cols-2 lg:gap-16 lg:p-14">
          {/* The photo has a pure white background, so it sits directly on the white panel. */}
          <div className="relative order-last aspect-[4/3] lg:order-first">
            <Image src={celebrating} alt="A delighted customer holding Rand notes" fill placeholder="blur" sizes="(min-width: 1024px) 45vw, 100vw" className="object-contain" />
          </div>
          <div>
            <SectionHeading eyebrow="Our Benefits" title="Why Choose" highlight="Us?" />
            <p className="t-lead text-ink/75 mt-6">
              Select Cashflow Loans for customized financial solutions designed for your unique journey. We offer secured and
              unsecured personal loans, utilizing flexible collateral like mobile devices or vehicle titles to ensure accessibility.
              With swift, dependable service and unwavering integrity, we empower everyone to achieve financial stability and
              freedom, supporting your aspirations with trust and confidence, regardless of your background.
            </p>
            <Button asChild size="lg" className="mt-9">
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
