import Image from "next/image";
import { company } from "@cashflow/core";

import { Container } from "@/components/shared/Container";
import { Highlight } from "@/components/shared/Highlight";
import { Pill } from "@/components/shared/Pill";
import mark from "@public/images/logo-mark.png";
import wallet from "@public/images/wallet-with-rand-notes.jpeg";
import handing from "@public/images/handing-over-rand-notes.jpeg";

/** "Company Introductions" from the original homepage, copy unchanged, as a deep-green statement panel. */
export function CompanyIntro() {
  return (
    <section className="pb-20 sm:pb-28">
      <Container>
        <div data-surface="dark" className="bg-brand-950 rounded-[2rem] p-6 text-white sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-14">
            <div className="lg:col-span-7">
              <Pill tone="dark">Company Introductions</Pill>
              <h2 className="t-h2 mt-6">
                Our Loans will Fill Your <Highlight tone="dark">Dreams Come True</Highlight>
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pt-16">
              <p className="text-white/75">
                At Cashflow Loans, we provide tailored financial solutions designed to meet your unique needs. Whether you&apos;re
                facing urgent expenses or planning for life&apos;s big moments, our secured and unsecured personal loans offer
                flexibility and fast access to funds. By accepting collateral such as mobile devices, vehicle titles, or property,
                we ensure loan accessibility for clients from all walks of life. With a strong focus on trust, speed, and care,
                we&apos;re committed to helping you achieve financial stability. Cashflow Loans — your reliable partner in
                navigating life&apos;s financial challenges.
              </p>
              <div className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
                <Image src={mark} alt="" className="h-12 w-auto" />
                <div>
                  <p className="font-medium">Certified Company</p>
                  <p className="text-sm text-white/60">Approved Finance company to provide loans</p>
                  {company.ncrNumber && <p className="text-sage mt-1 text-sm font-medium">NCR reg. no. {company.ncrNumber}</p>}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16">
            {[
              { src: wallet, alt: "Rand notes being taken from a wallet" },
              { src: handing, alt: "Rand notes being handed over" },
            ].map((img) => (
              <div key={img.alt} className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] lg:aspect-[16/10]">
                <Image src={img.src} alt={img.alt} fill placeholder="blur" sizes="(min-width: 640px) 45vw, 100vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
