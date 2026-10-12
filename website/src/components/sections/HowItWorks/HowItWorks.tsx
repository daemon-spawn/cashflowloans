"use client";

import { useState } from "react";
import Image from "next/image";
import type { LoanType } from "@cashflow/core";
import { cn } from "@cashflow/ui/lib/utils";

import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import hands from "@public/images/hands-holding-rand-notes.jpeg";

const steps: Record<LoanType, { title: string; detail: string }[]> = {
  unsecured: [
    { title: "Apply online", detail: "Fill in the form on your phone. It takes about 5 minutes." },
    { title: "Upload your documents", detail: "Your ID, latest payslip and a 3-month bank statement." },
    { title: "Get approved", detail: "We review your application and confirm by email." },
    { title: "Approve DebiCheck", detail: "Confirm the debit order with your bank. The money is in your account within 15 minutes." },
  ],
  secured: [
    { title: "Apply online", detail: "Fill in the form on your phone. It takes about 5 minutes." },
    { title: "Show us your collateral", detail: "Upload photos of your phone, car title or property papers." },
    { title: "Free collection", detail: "Our courier partners collect your item anywhere in South Africa, at no cost." },
    { title: "Inspection and payout", detail: "Once we've checked the item, the approved amount is paid into your bank account." },
  ],
};

/** The four steps are a real sequence, so they carry the oversized numerals. */
export function HowItWorks() {
  const [type, setType] = useState<LoanType>("unsecured");

  return (
    <section className="bg-sage py-20 sm:py-28">
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-x-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHeading eyebrow="How it works" title="From application to" highlight="money in your account" />
            <div className="relative mt-10 aspect-[3/2] overflow-hidden rounded-[1.5rem]">
              <Image src={hands} alt="Hands holding South African bank notes" fill placeholder="blur" sizes="(min-width: 1024px) 38vw, 100vw" className="object-cover" />
            </div>
          </div>
        </div>
        <div className="lg:col-span-7">
          <div role="radiogroup" aria-label="Loan type" className="bg-card inline-flex rounded-full p-1">
            {(["unsecured", "secured"] as const).map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={type === t}
                onClick={() => setType(t)}
                className={cn(
                  "min-h-10 rounded-full px-6 text-[0.9375rem] font-medium capitalize transition-colors",
                  type === t ? "bg-brand-900 text-white" : "text-ink/70 hover:text-ink",
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <ol className="mt-10">
            {steps[type].map((s, i) => (
              <li key={s.title} className="border-brand-900/15 grid grid-cols-[5.5rem_minmax(0,1fr)] items-start gap-6 border-t py-9 sm:grid-cols-[8rem_minmax(0,1fr)]">
                <span className="t-numeral text-brand-900 text-[clamp(3.5rem,2.8rem+2.4vw,5.5rem)]">{String(i + 1).padStart(2, "0")}</span>
                <div className="pt-2">
                  <p className="t-h3 text-[1.5rem]">{s.title}</p>
                  <p className="text-ink/70 mt-2 max-w-[42ch]">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="text-ink/60 border-brand-900/15 border-t pt-6 text-[0.9375rem]">You can also apply on WhatsApp or by phone. The steps are the same.</p>
        </div>
      </Container>
    </section>
  );
}
