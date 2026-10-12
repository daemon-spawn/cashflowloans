import type { Metadata } from "next";
import { Suspense } from "react";
import { company, whatsappLink } from "@cashflow/core";

import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { LoanCalculator } from "@/components/sections/LoanCalculator";
import { ApplicationForm } from "@/components/forms/ApplicationForm";

export const metadata: Metadata = {
  title: "Apply for a loan",
  description: "Apply online for a secured or unsecured loan from Cashflow Loans. It takes about 5 minutes.",
};

async function readPrefill(searchParams: PageProps<"/apply">["searchParams"]) {
  const { type, amount } = await searchParams;
  return {
    defaultType: type === "secured" ? ("secured" as const) : ("unsecured" as const),
    defaultAmount: typeof amount === "string" ? Number(amount) || undefined : undefined,
  };
}

async function PrefilledForm({ searchParams }: { searchParams: PageProps<"/apply">["searchParams"] }) {
  return <ApplicationForm {...await readPrefill(searchParams)} />;
}

async function PrefilledCalculator({ searchParams }: { searchParams: PageProps<"/apply">["searchParams"] }) {
  return <LoanCalculator showCta={false} {...await readPrefill(searchParams)} />;
}

export default function ApplyPage({ searchParams }: PageProps<"/apply">) {
  return (
    <>
      <PageHeader
        eyebrow="Apply online"
        title="Apply for a loan"
        highlight="in about 5 minutes."
        description={
          <>
            Have your ID and documents ready. Prefer to apply by message?{" "}
            <a href={whatsappLink("Hi Cashflow Loans, I'd like to apply for a loan.")} target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-4">
              WhatsApp {company.phoneDisplay}
            </a>
            .
          </>
        }
      />
      <section className="py-14 sm:py-20">
        <Container className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-10">
          <div className="bg-card rounded-[2rem] p-6 sm:p-10">
            <Suspense>
              <PrefilledForm searchParams={searchParams} />
            </Suspense>
          </div>
          <aside className="grid gap-5 lg:sticky lg:top-28 lg:self-start">
            <Suspense fallback={<LoanCalculator showCta={false} />}>
              <PrefilledCalculator searchParams={searchParams} />
            </Suspense>
            <div className="bg-sage rounded-[1.75rem] p-7">
              <p className="t-h3 text-[1.125rem]">What you&apos;ll need</p>
              <dl className="mt-4 grid gap-4 text-[0.9375rem]">
                <div>
                  <dt className="font-medium">Unsecured</dt>
                  <dd className="text-ink/70">ID, latest payslip and a 3-month bank statement (PDF).</dd>
                </div>
                <div>
                  <dt className="font-medium">Secured</dt>
                  <dd className="text-ink/70">ID and photos of your phone, vehicle title or property documents.</dd>
                </div>
              </dl>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
