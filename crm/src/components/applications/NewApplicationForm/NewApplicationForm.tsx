"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { APPLICATION_SOURCES, calculateRepayment, formatRand, maxAmountFor, minAmountFor, type LoanType } from "@cashflow/core";
import { Button } from "@cashflow/ui/components/button";
import { Input } from "@cashflow/ui/components/input";
import { Label } from "@cashflow/ui/components/label";
import { Select } from "@cashflow/ui/components/select";
import { cn } from "@cashflow/ui/lib/utils";

import { Panel } from "@/components/shared/Panel";
import { humanize } from "@/lib/format";
import type { Application, Client } from "@/lib/types";
import { postMultipart } from "@/lib/upload";

type Errors = Record<string, string[] | undefined>;

function Field({ id, label, errors, hint, children, className }: { id: string; label: string; errors: Errors; hint?: string; children: React.ReactNode; className?: string }) {
  const error = errors[id]?.[0];
  return (
    <div className={cn("grid content-start gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? <p className="text-destructive text-xs">{error}</p> : hint ? <p className="text-muted-foreground text-xs">{hint}</p> : null}
    </div>
  );
}

/** For applications taken by phone, WhatsApp, email or in person. Documents can be added now or later. */
export function NewApplicationForm({ client, today }: { client?: Client; today: string }) {
  const router = useRouter();
  const [type, setType] = useState<LoanType>("unsecured");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const repay = Number(amount) > 0 ? calculateRepayment(Number(amount)) : null;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const data = {
      source: f.get("source"),
      loanType: type,
      amount: Number(f.get("amount")),
      repaymentDate: f.get("repaymentDate"),
      firstName: f.get("firstName"),
      lastName: f.get("lastName"),
      idNumber: f.get("idNumber"),
      phone: f.get("phone"),
      email: f.get("email"),
      acceptedTerms: f.get("acceptedTerms") === "on" ? true : false,
    };
    const body = new FormData();
    body.set("data", JSON.stringify(data));
    for (const field of ["idDocument", "payslip", "bankStatement", "collateralImages"]) {
      for (const file of f.getAll(field)) if (file instanceof File && file.size > 0) body.append(field, file);
    }
    startTransition(async () => {
      const res = await postMultipart<Application>("/applications", body);
      if (!res.ok) {
        setErrors(res.fields ?? {});
        setError(res.error);
        return;
      }
      router.push(`/applications/${res.data.id}`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <Panel title="Loan">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Field id="source" label="Received via" errors={errors}>
            <Select id="source" name="source" defaultValue="whatsapp">
              {APPLICATION_SOURCES.filter((s) => s !== "website").map((s) => (
                <option key={s} value={s}>
                  {humanize(s)}
                </option>
              ))}
            </Select>
          </Field>
          <Field id="loanType" label="Loan type" errors={errors}>
            <Select id="loanType" value={type} onChange={(e) => setType(e.target.value as LoanType)}>
              <option value="unsecured">Unsecured</option>
              <option value="secured">Secured</option>
            </Select>
          </Field>
          <Field
            id="amount"
            label="Amount (R)"
            errors={errors}
            hint={repay ? `Repays ${formatRand(repay.total)}` : `${formatRand(minAmountFor(type))} to ${formatRand(maxAmountFor(type))}`}
          >
            <Input id="amount" name="amount" type="number" inputMode="numeric" min={minAmountFor(type)} max={maxAmountFor(type)} value={amount} onChange={(e) => setAmount(e.target.value)} />
          </Field>
          <Field id="repaymentDate" label="Wants to repay on" errors={errors}>
            <Input id="repaymentDate" name="repaymentDate" type="date" min={today} />
          </Field>
        </div>
      </Panel>

      <Panel title="Applicant" description={client ? "Pre-filled from the client profile. Changes update their record." : "Repeat clients are matched by ID number."}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="firstName" label="First name" errors={errors}>
            <Input id="firstName" name="firstName" defaultValue={client?.firstName} autoComplete="off" />
          </Field>
          <Field id="lastName" label="Surname" errors={errors}>
            <Input id="lastName" name="lastName" defaultValue={client?.lastName} autoComplete="off" />
          </Field>
          <Field id="idNumber" label="SA ID number" errors={errors}>
            <Input id="idNumber" name="idNumber" inputMode="numeric" maxLength={13} defaultValue={client?.idNumber} />
          </Field>
          <Field id="phone" label="Cellphone" errors={errors}>
            <Input id="phone" name="phone" type="tel" defaultValue={client?.phone} />
          </Field>
          <Field id="email" label="Email" errors={errors} className="sm:col-span-2" hint="Approval, payout and reminder emails go here.">
            <Input id="email" name="email" type="email" defaultValue={client?.email} />
          </Field>
        </div>
      </Panel>

      <Panel title="Documents" description="Optional now. You can upload them from the application later.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="idDocument" label="Copy of ID" errors={errors}>
            <Input id="idDocument" name="idDocument" type="file" accept=".pdf,image/*" />
          </Field>
          {type === "unsecured" ? (
            <>
              <Field id="payslip" label="Latest payslip" errors={errors}>
                <Input id="payslip" name="payslip" type="file" accept=".pdf,image/*" />
              </Field>
              <Field id="bankStatement" label="3-month bank statement (PDF)" errors={errors}>
                <Input id="bankStatement" name="bankStatement" type="file" accept=".pdf" />
              </Field>
            </>
          ) : (
            <Field id="collateralImages" label="Photos of the collateral" errors={errors} hint="Up to 6 photos">
              <Input id="collateralImages" name="collateralImages" type="file" accept="image/*" multiple />
            </Field>
          )}
        </div>
      </Panel>

      <div className="bg-card grid gap-4 rounded-xl border p-5">
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" name="acceptedTerms" className="mt-1" />
          <span>The applicant has been told about and accepted the Terms and Conditions, including the 50% fee and the late charge.</span>
        </label>
        {errors.acceptedTerms && <p className="text-destructive -mt-2 text-xs">Confirm the applicant accepted the terms.</p>}
        {error && (
          <p role="alert" className="text-destructive text-sm">
            {error}
          </p>
        )}
        <Button type="submit" disabled={pending} className="justify-self-start">
          {pending ? "Saving…" : "Create application"}
        </Button>
      </div>
    </form>
  );
}
