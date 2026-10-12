import type { Metadata } from "next";
import { Suspense } from "react";

import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { LoanCalculator } from "@/components/sections/LoanCalculator";
import { ApplicationForm } from "@/components/forms/ApplicationForm";

export const metadata: Metadata = { title: "Apply for a loan" };

async function PrefilledForm({ searchParams }: { searchParams: PageProps<"/apply">["searchParams"] }) {
  const { type, amount } = await searchParams;
  return (
    <ApplicationForm
      defaultType={type === "secured" ? "secured" : "unsecured"}
      defaultAmount={typeof amount === "string" ? Number(amount) || undefined : undefined}
    />
  );
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
          <LoanCalculator />
        </aside>
      </Container>
    </>
  );
}
