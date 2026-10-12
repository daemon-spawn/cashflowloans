import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@cashflow/ui/components/button";

import { Container } from "@/components/shared/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { SafetyPoints } from "@/components/sections/SafetyPoints";
import { FinalCta } from "@/components/sections/FinalCta";
import mark from "@public/images/logo-mark.png";
import customer from "@public/images/customer-thumbs-up-blue.jpeg";
import cardPayment from "@public/images/card-payment.jpeg";

export const metadata: Metadata = {
  title: "About us",
  description: "Cashflow Loans offers secured and unsecured personal loans to South Africans from all walks of life, with fast, reliable service.",
};

const offers = [
  { title: "Secured loans", body: "Leveraging collateral like mobile devices, vehicle titles, or property titles." },
  { title: "Unsecured loans", body: "No collateral, with a DebiCheck authorisation you approve with your own bank." },
  { title: "Fast, reliable service", body: "Unsecured loans are paid out within 15 minutes of DebiCheck approval." },
];

/** "Trusted Company / Get To Know About Us" from the original about page, copy unchanged. */
export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Trusted Company"
        title="Get To Know"
        highlight="About Us"
        description="Fast, fair access to credit for South Africans, whatever your background."
        image={customer}
        imageAlt="A delighted customer holding Rand notes and giving a thumbs up"
      >
        <Button asChild size="lg" variant="inverse">
          <Link href="/how-it-works">How it works</Link>
        </Button>
        <Button asChild size="lg" variant="onDark">
          <Link href="/contact">Contact us</Link>
        </Button>
      </PageHeader>

      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
              <Image src={cardPayment} alt="A customer paying by card" fill placeholder="blur" sizes="(min-width: 1024px) 38vw, 100vw" className="object-cover" />
            </div>
          </div>
          <div className="lg:col-span-7 lg:pt-6">
            <SectionHeading eyebrow="Our story" title="Few Words About" highlight="Our Company" />
            <div className="t-lead text-ink/75 mt-8 grid max-w-[40rem] gap-5">
              <p>
                Cashflow Loans is dedicated to empowering individuals with tailored financial solutions. Since our inception, we&apos;ve
                offered secured and unsecured personal loans to meet diverse needs, from urgent expenses to life&apos;s big moments.
              </p>
              <p>
                By leveraging collateral like mobile devices, vehicle titles, or property titles, our secured loans ensure accessibility
                for all backgrounds. With a commitment to fast, reliable service, we prioritize trust and flexibility, helping clients
                achieve financial freedom and stability.
              </p>
              <p>
                Cashflow Loans is your trusted partner in navigating life&apos;s financial challenges, delivering innovative funding
                options with integrity and care, no matter the goal.
              </p>
            </div>
            <dl className="border-border mt-12 grid gap-8 border-t pt-8 sm:grid-cols-3">
              {offers.map((o) => (
                <div key={o.title}>
                  <dt className="t-h3 text-[1.125rem]">{o.title}</dt>
                  <dd className="text-muted-foreground mt-2 text-[0.9375rem]">{o.body}</dd>
                </div>
              ))}
            </dl>
            <div className="bg-brand-950 mt-12 flex items-center gap-4 rounded-[1.5rem] p-6 text-white" data-surface="dark">
              <Image src={mark} alt="" className="h-12 w-auto" />
              <div>
                <p className="font-medium">Certified Company</p>
                <p className="text-sm text-white/60">Approved Finance company to provide loans</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <WhyChooseUs />
      <SafetyPoints />
      <FinalCta />
    </>
  );
}
