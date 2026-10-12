"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { applicationSchema, calculateRepayment, formatRand, maxAmountFor, minAmountFor, type LoanType } from "@cashflow/core";
import { Button } from "@cashflow/ui/components/button";
import { Input } from "@cashflow/ui/components/input";

import { Field } from "@/components/forms/Field";
import { TermsPreview } from "@/components/forms/TermsPreview";
import { FileInput, MAX_FILE_BYTES } from "@/components/forms/FileInput";
import { ApiError, submitApplication, type ApplicationFiles } from "@/lib/api";
import { parsePrefill } from "@/lib/prefill";

type FormIn = z.input<typeof applicationSchema>;
type FormOut = z.output<typeof applicationSchema>;

type Props = { defaultType?: LoanType; defaultAmount?: number };

const REQUIRED_FILES: Record<LoanType, (keyof ApplicationFiles)[]> = {
  unsecured: ["idDocument", "payslip", "bankStatement"],
  secured: ["idDocument", "collateralImages"],
};

export function ApplicationForm({ defaultType = "unsecured", defaultAmount }: Props) {
  const [files, setFiles] = useState<ApplicationFiles>({});
  const [fileErrors, setFileErrors] = useState<Partial<Record<keyof ApplicationFiles, string>>>({});
  const [result, setResult] = useState<{ reference: string }>();
  const [serverError, setServerError] = useState<string>();

  // The URL is the source of truth for the calculator's choice; props are the server-rendered fallback.
  const params = useSearchParams();
  const urlType = params.get("type");
  const urlAmount = params.get("amount");
  const initial = parsePrefill(urlType ?? defaultType, urlAmount);

  const { register, handleSubmit, control, setValue, getValues, formState } = useForm<FormIn, unknown, FormOut>({
    resolver: zodResolver(applicationSchema),
    defaultValues: { loanType: initial.type, amount: initial.amount ?? defaultAmount ?? "" },
  });

  // Keep the fields in step when the query string changes without a remount
  // (client navigation, a restored page), unless the applicant already typed the same thing.
  useEffect(() => {
    const prefill = parsePrefill(urlType, urlAmount);
    if (urlType && getValues("loanType") !== prefill.type) setValue("loanType", prefill.type);
    if (prefill.amount !== undefined && Number(getValues("amount")) !== prefill.amount) setValue("amount", prefill.amount);
  }, [urlType, urlAmount, getValues, setValue]);
  const { errors, isSubmitting } = formState;
  const loanType = useWatch({ control, name: "loanType" }) as LoanType;
  const amount = Number(useWatch({ control, name: "amount" })) || 0;

  const setFile = (kind: keyof ApplicationFiles, list: File[]) => {
    const tooBig = list.some((f) => f.size > MAX_FILE_BYTES);
    setFileErrors((e) => ({ ...e, [kind]: tooBig ? "Each file must be 10 MB or less" : undefined }));
    setFiles((f) => ({ ...f, [kind]: kind === "collateralImages" ? list : list[0] }));
  };

  const onSubmit = async (values: FormOut) => {
    const missing = REQUIRED_FILES[values.loanType].filter((k) => {
      const v = files[k];
      return Array.isArray(v) ? v.length === 0 : !v;
    });
    if (missing.length) {
      setFileErrors(Object.fromEntries(missing.map((k) => [k, "This document is required"])));
      return;
    }
    if (Object.values(fileErrors).some(Boolean)) return;

    setServerError(undefined);
    try {
      setResult(await submitApplication(values, files));
    } catch (err) {
      // Never pretend a failed submission succeeded — the applicant must know to retry or WhatsApp us.
      setServerError(err instanceof ApiError ? err.message : "We couldn't reach our servers. Please try again or WhatsApp us.");
    }
  };

  if (result) {
    return (
      <div role="status" className="bg-sage text-brand-900 rounded-2xl p-8">
        <h2 className="text-2xl font-semibold">Application received</h2>
        <p className="mt-2">Your reference is <strong>{result.reference}</strong>. We&apos;ll be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-6">
      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium">Loan type</legend>
        <div className="grid grid-cols-2 gap-3">
          {(["unsecured", "secured"] as const).map((t) => (
            <label key={t} className="has-checked:border-primary has-checked:bg-accent flex cursor-pointer items-center gap-2 rounded-lg border p-4 capitalize">
              <input type="radio" value={t} {...register("loanType")} onChange={() => setValue("loanType", t)} checked={loanType === t} />
              {t}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="amount" label="Amount (R)" error={errors.amount?.message}
          hint={`${formatRand(minAmountFor(loanType))} to ${formatRand(maxAmountFor(loanType))}${amount > 0 ? ` · you repay ${formatRand(calculateRepayment(amount).total)}` : ""}`}>
          <Input id="amount" type="number" inputMode="numeric" aria-invalid={!!errors.amount} {...register("amount")} />
        </Field>
        <Field id="repaymentDate" label="Repayment date" error={errors.repaymentDate?.message}>
          <Input id="repaymentDate" type="date" aria-invalid={!!errors.repaymentDate} {...register("repaymentDate")} />
        </Field>
        <Field id="firstName" label="First name" error={errors.firstName?.message}>
          <Input id="firstName" autoComplete="given-name" aria-invalid={!!errors.firstName} {...register("firstName")} />
        </Field>
        <Field id="lastName" label="Surname" error={errors.lastName?.message}>
          <Input id="lastName" autoComplete="family-name" aria-invalid={!!errors.lastName} {...register("lastName")} />
        </Field>
        <Field id="idNumber" label="SA ID number" error={errors.idNumber?.message}>
          <Input id="idNumber" inputMode="numeric" maxLength={13} aria-invalid={!!errors.idNumber} {...register("idNumber")} />
        </Field>
        <Field id="phone" label="Cellphone" error={errors.phone?.message}>
          <Input id="phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone} {...register("phone")} />
        </Field>
        <Field id="email" label="Email" error={errors.email?.message} className="sm:col-span-2">
          <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
        </Field>
      </div>

      <fieldset className="grid gap-5">
        <legend className="mb-2 font-medium">Documents</legend>
        <FileInput id="idDocument" label="Copy of ID" accept=".pdf,image/*" error={fileErrors.idDocument} onFiles={(f) => setFile("idDocument", f)} />
        {loanType === "unsecured" ? (
          <>
            <FileInput id="payslip" label="Latest payslip" accept=".pdf,image/*" error={fileErrors.payslip} onFiles={(f) => setFile("payslip", f)} />
            <FileInput id="bankStatement" label="3-month bank statement" accept=".pdf" hint="PDF, up to 10 MB" error={fileErrors.bankStatement} onFiles={(f) => setFile("bankStatement", f)} />
          </>
        ) : (
          <FileInput id="collateralImages" label="Photos of your collateral" accept="image/*" multiple hint="Up to 6 photos, 10 MB each" error={fileErrors.collateralImages} onFiles={(f) => setFile("collateralImages", f)} />
        )}
      </fieldset>

      <TermsPreview />
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" className="mt-1" {...register("acceptedTerms")} />
        <span>
          I have read and accept the <a href="/legal/terms" className="underline" target="_blank">terms &amp; conditions</a> and consent to my information being processed in line with the <a href="/legal/privacy" className="underline" target="_blank">privacy policy</a>.
        </span>
      </label>
      {errors.acceptedTerms && <p role="alert" className="text-destructive -mt-4 text-sm">{errors.acceptedTerms.message}</p>}

      {serverError && <p role="alert" className="text-destructive">{serverError}</p>}
      <Button type="submit" size="lg" disabled={isSubmitting}>{isSubmitting ? "Submitting…" : "Submit application"}</Button>
    </form>
  );
}
