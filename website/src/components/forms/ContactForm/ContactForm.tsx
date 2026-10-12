"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@cashflow/core";
import { Button } from "@cashflow/ui/components/button";
import { Input } from "@cashflow/ui/components/input";
import { Textarea } from "@cashflow/ui/components/textarea";

import { Field } from "@/components/forms/Field";
import { submitContact } from "@/lib/api";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState<string>();
  const { register, handleSubmit, reset, formState } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });
  const { errors, isSubmitting } = formState;

  const onSubmit = async (values: ContactInput) => {
    try {
      await submitContact(values);
      setStatus("sent");
      reset();
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : undefined);
    }
  };

  if (status === "sent") {
    return <p role="status" className="bg-brand-50 text-brand-900 rounded-xl p-6">Thanks — we&apos;ll get back to you shortly.</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Name" error={errors.name?.message}>
          <Input id="name" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} />
        </Field>
        <Field id="email" label="Email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
        </Field>
      </div>
      <Field id="phone" label="Phone (optional)" error={errors.phone?.message}>
        <Input id="phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone} {...register("phone")} />
      </Field>
      <Field id="message" label="Message" error={errors.message?.message}>
        <Textarea id="message" rows={5} aria-invalid={!!errors.message} {...register("message")} />
      </Field>
      {status === "error" && <p role="alert" className="text-destructive text-sm">{serverError ?? "Could not send your message."}</p>}
      <Button type="submit" size="lg" disabled={isSubmitting}>{isSubmitting ? "Sending…" : "Send message"}</Button>
    </form>
  );
}
