/**
 * Client for the Flask API. Public endpoints only — the website never holds
 * credentials. Files are sent as multipart so documents reach the CRM.
 */
import type { ApplicationInput, ContactInput } from "@cashflow/core";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public fields?: Record<string, string[]>,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, init);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(body.error ?? "Something went wrong. Please try again.", res.status, body.fields);
  }
  return body as T;
}

export type ApplicationFiles = Partial<Record<"idDocument" | "payslip" | "bankStatement", File>> & {
  collateralImages?: File[];
};

export function submitApplication(input: ApplicationInput, files: ApplicationFiles, turnstileToken?: string) {
  const form = new FormData();
  form.append("data", JSON.stringify(input));
  for (const [kind, value] of Object.entries(files)) {
    for (const file of Array.isArray(value) ? value : value ? [value] : []) form.append(kind, file);
  }
  if (turnstileToken) form.append("turnstileToken", turnstileToken);
  return request<{ reference: string }>("/v1/public/applications", { method: "POST", body: form });
}

export function submitContact(input: ContactInput, turnstileToken?: string) {
  return request<{ ok: true }>("/v1/public/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, turnstileToken }),
  });
}
