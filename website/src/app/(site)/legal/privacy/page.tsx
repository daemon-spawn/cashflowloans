import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <>
      <PageHeader title="Privacy Policy" />
      <Container className="max-w-3xl py-20">
        {/* TODO: owner to supply final legal copy. */}
      </Container>
    </>
  );
}
