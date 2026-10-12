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

export function HowItWorks() {
  const [type, setType] = useState<LoanType>("unsecured");

  return (
    <section className="bg-sage py-20 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-x-12">
        <div className="relative aspect-[3/2] self-start overflow-hidden rounded-xl lg:sticky lg:top-28 lg:col-span-5">
          <Image src={hands} alt="Hands holding South African bank notes" fill placeholder="blur" sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
        </div>
        <div className="lg:col-span-7 lg:py-4">
          <SectionHeading eyebrow="How it works" title="From application to money in your account" />
          <div role="radiogroup" aria-label="Loan type" className="border-input bg-card mt-8 inline-flex rounded-lg border p-1">
            {(["unsecured", "secured"] as const).map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={type === t}
                onClick={() => setType(t)}
                className={cn(
                  "min-h-10 rounded-md px-5 text-[0.9375rem] font-semibold capitalize transition-colors",
                  type === t ? "bg-brand-900 text-white" : "text-ink/70 hover:text-ink",
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <ol className="border-border mt-8 border-t">
            {steps[type].map((s, i) => (
              <li key={s.title} className="border-border grid grid-cols-[3rem_minmax(0,1fr)] gap-4 border-b py-6">
                <span className="font-display text-brand-700 text-2xl font-bold">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="t-h3">{s.title}</p>
                  <p className="text-muted-foreground mt-1.5 max-w-[46ch]">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="text-muted-foreground mt-6 text-[0.9375rem]">You can also apply on WhatsApp or by phone. The steps are the same.</p>
        </div>
      </Container>
    </section>
  );
}
