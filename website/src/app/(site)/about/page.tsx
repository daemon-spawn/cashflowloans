import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const metadata: Metadata = { title: "About us" };

export default function AboutPage() {
  return (
    <>
      <PageHeader title="About Cashflow Loans" description="Fast, fair access to credit for South Africans the banks overlook." />
      <Container className="prose max-w-3xl py-20">
        <p>
          We provide secured and unsecured personal loans with flexible collateral — mobile devices, vehicle titles or
          property — so more people can get the funds they need, quickly and transparently.
        </p>
      </Container>
      <CtaBanner />
    </>
  );
}
