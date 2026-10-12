import Image from "next/image";

import { Container } from "@/components/shared/Container";
import mark from "@public/images/logo-mark.png";

/** "Company Introductions" from the original homepage, copy unchanged. */
export function CompanyIntro() {
  return (
    <section className="pt-20 sm:pt-28">
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-x-16">
        <div className="lg:col-span-5">
          <p className="t-meta text-brand-700">Company Introductions</p>
          <h2 className="t-h2 mt-3">Our Loans will Fill Your Dreams Come True</h2>
        </div>
        <div className="lg:col-span-7">
          <p className="t-lead text-ink/80">
            At Cashflow Loans, we provide tailored financial solutions designed to meet your unique needs. Whether you&apos;re
            facing urgent expenses or planning for life&apos;s big moments, our secured and unsecured personal loans offer
            flexibility and fast access to funds. By accepting collateral such as mobile devices, vehicle titles, or property, we
            ensure loan accessibility for clients from all walks of life. With a strong focus on trust, speed, and care,
            we&apos;re committed to helping you achieve financial stability. Cashflow Loans — your reliable partner in navigating
            life&apos;s financial challenges.
          </p>
          <div data-surface="dark" className="bg-brand-950 mt-10 inline-flex items-center gap-5 rounded-xl py-4 pr-7 pl-4 text-white">
            <Image src={mark} alt="" className="h-14 w-auto" />
            <div>
              <p className="font-display text-lg font-semibold">Certified Company</p>
              <p className="text-sm text-white/75">Approved Finance company to provide loans</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
