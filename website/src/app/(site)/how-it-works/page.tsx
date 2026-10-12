import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";

export const metadata: Metadata = { title: "How it works" };

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader title="How it works" description="Two ways to borrow. Pick the one that suits you." />
      <Container className="grid gap-6 py-20 md:grid-cols-2">
        <Link href="/how-it-works/unsecured" className="hover:border-primary rounded-2xl border p-8">
          <h2 className="text-2xl font-semibold">Unsecured loan</h2>
          <p className="text-muted-foreground mt-2">No collateral. Approve a DebiCheck and get paid in 15 minutes.</p>
        </Link>
        <Link href="/how-it-works/secured" className="hover:border-primary rounded-2xl border p-8">
          <h2 className="text-2xl font-semibold">Secured loan</h2>
          <p className="text-muted-foreground mt-2">From R500 against your phone, vehicle title or property. Free courier collection.</p>
        </Link>
      </Container>
    </>
  );
}
