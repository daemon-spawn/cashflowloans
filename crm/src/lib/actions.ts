"use server";

import { revalidatePath } from "next/cache";

import type { ActionState } from "@/lib/action-state";
import { ApiError, api } from "@/lib/api";
import type { ReminderRun } from "@/lib/types";

const text = (form: FormData, key: string) => {
  const v = form.get(key);
  return typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;
};

async function run(call: () => Promise<unknown>, message?: string): Promise<ActionState> {
  try {
    await call();
  } catch (err) {
    if (err instanceof ApiError) {
      return { ok: false, error: err.message, fields: err.fields, needsOverride: Boolean(err.fields?.override) };
    }
    return { ok: false, error: "Couldn't reach the API. Check your connection and try again." };
  }
  // Every CRM page is dynamic; this refreshes whatever the user is looking at.
  revalidatePath("/", "layout");
  return { ok: true, message };
}

const json = (body: unknown) => ({ body: JSON.stringify(body) });

// --- Applications ---

export async function setApplicationStatus(
  id: string,
  status: string,
  options: { declineReason?: string; override?: boolean } = {},
): Promise<ActionState> {
  return run(() => api(`/applications/${id}/status`, { method: "PATCH", ...json({ status, ...options }) }));
}

export async function declineApplication(_: ActionState, form: FormData): Promise<ActionState> {
  return setApplicationStatus(String(form.get("id")), "declined", { declineReason: text(form, "declineReason") });
}

// --- Loans ---

export async function payOut(_: ActionState, form: FormData): Promise<ActionState> {
  const id = String(form.get("loanId"));
  return run(
    () => api(`/loans/${id}/payout`, { method: "POST", ...json({ paidOutOn: text(form, "paidOutOn"), dueDate: text(form, "dueDate") }) }),
    "Marked as paid out. The borrower has been emailed.",
  );
}

export async function recordPayment(_: ActionState, form: FormData): Promise<ActionState> {
  const id = String(form.get("loanId"));
  return run(
    () =>
      api(`/loans/${id}/payments`, {
        method: "POST",
        ...json({
          amount: text(form, "amount"),
          paidOn: text(form, "paidOn"),
          method: text(form, "method") ?? "eft",
          reference: text(form, "reference"),
          notes: text(form, "notes"),
        }),
      }),
    "Payment recorded.",
  );
}

export async function deletePayment(loanId: string, paymentId: string): Promise<ActionState> {
  return run(() => api(`/loans/${loanId}/payments/${paymentId}`, { method: "DELETE" }), "Payment removed.");
}

export async function writeOff(_: ActionState, form: FormData): Promise<ActionState> {
  const id = String(form.get("loanId"));
  return run(() => api(`/loans/${id}/write-off`, { method: "POST", ...json({ reason: text(form, "reason") }) }), "Loan written off.");
}

export async function updateCollateral(_: ActionState, form: FormData): Promise<ActionState> {
  const id = String(form.get("loanId"));
  return run(
    () =>
      api(`/loans/${id}/collateral`, {
        method: "PATCH",
        ...json({ status: text(form, "status"), description: String(form.get("description") ?? "") }),
      }),
    "Collateral updated.",
  );
}

// --- Clients ---

export async function updateClient(_: ActionState, form: FormData): Promise<ActionState> {
  const id = String(form.get("clientId"));
  return run(
    () =>
      api(`/clients/${id}`, {
        method: "PATCH",
        ...json({
          firstName: text(form, "firstName"),
          lastName: text(form, "lastName"),
          email: text(form, "email"),
          phone: text(form, "phone"),
        }),
      }),
    "Contact details saved.",
  );
}

export async function setBlacklist(_: ActionState, form: FormData): Promise<ActionState> {
  const id = String(form.get("clientId"));
  const blacklisted = form.get("blacklisted") === "true";
  return run(
    () => api(`/clients/${id}/blacklist`, { method: "POST", ...json({ blacklisted, reason: text(form, "reason") }) }),
    blacklisted ? "Client blacklisted." : "Removed from the blacklist.",
  );
}

export async function addNote(_: ActionState, form: FormData): Promise<ActionState> {
  const id = String(form.get("clientId"));
  return run(
    () =>
      api(`/clients/${id}/notes`, {
        method: "POST",
        ...json({ body: text(form, "body"), applicationId: text(form, "applicationId"), loanId: text(form, "loanId") }),
      }),
    "Note added.",
  );
}

// --- Messages and settings ---

export async function setMessageStatus(id: string, status: "new" | "handled"): Promise<ActionState> {
  return run(() => api(`/messages/${id}`, { method: "PATCH", ...json({ status }) }));
}

export async function sendTestEmail(): Promise<ActionState> {
  try {
    const res = await api<{ sent: boolean; emailConfigured: boolean }>("/settings/test-email", { method: "POST" });
    if (!res.emailConfigured) return { ok: false, error: "Email isn't set up on the API yet (SMTP settings on Render)." };
    return res.sent ? { ok: true, message: "Test email sent." } : { ok: false, error: "The mail server rejected the message." };
  } catch (err) {
    return { ok: false, error: err instanceof ApiError ? err.message : "Couldn't reach the API." };
  }
}

export async function runReminders(): Promise<ActionState & { result?: ReminderRun }> {
  try {
    const result = await api<ReminderRun>("/reminders/run", { method: "POST" });
    revalidatePath("/", "layout");
    return { ok: true, result };
  } catch (err) {
    return { ok: false, error: err instanceof ApiError ? err.message : "Couldn't reach the API." };
  }
}
