import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { FaqList } from "@/components/sections/FaqList";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { faq } from "@/content/faq";

export const metadata: Metadata = { title: "Frequently asked questions" };

export default function FaqPage() {
  return (
    <>
      <PageHeader title="Frequently asked questions" />
      <Container className="max-w-3xl py-20"><FaqList items={faq} /></Container>
      <CtaBanner title="Still have questions?" />
    </>
  );
}
