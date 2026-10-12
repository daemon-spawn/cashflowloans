import type { Metadata } from "next";
import { Suspense } from "react";

import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { LoanCalculator } from "@/components/sections/LoanCalculator";
import { ApplicationForm } from "@/components/forms/ApplicationForm";

export const metadata: Metadata = { title: "Apply for a loan" };

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
      <PageHeader title="Apply for a loan" description="It takes about 5 minutes. Have your ID and documents ready." />
      <Container className="grid gap-12 py-20 lg:grid-cols-[1fr_380px]">
        <Suspense>
          <PrefilledForm searchParams={searchParams} />
        </Suspense>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Suspense fallback={<LoanCalculator showCta={false} />}>
            <PrefilledCalculator searchParams={searchParams} />
          </Suspense>
        </aside>
      </Container>
    </>
  );
}
