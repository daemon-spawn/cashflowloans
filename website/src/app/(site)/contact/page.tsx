import type { Metadata } from "next";
import { company, whatsappLink } from "@cashflow/core";

import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = { title: "Contact us" };

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Contact us" description="WhatsApp is the fastest way to reach us." />
      <Container className="grid gap-12 py-20 lg:grid-cols-[1fr_1.5fr]">
        <ul className="space-y-4">
          <li><a className="font-medium underline" href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp {company.phoneDisplay}</a></li>
          <li><a href={`tel:${company.phone}`}>{company.phoneDisplay}</a></li>
          <li><a href={`mailto:${company.email}`}>{company.email}</a></li>
          <li className="text-muted-foreground">{company.hours}</li>
        </ul>
        <ContactForm />
      </Container>
    </>
  );
}
