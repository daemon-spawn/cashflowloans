"use client";

import { createClient } from "@/lib/supabase/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export type UploadResult<T> = { ok: true; data: T } | { ok: false; error: string; fields?: Record<string, string[]> };

/**
 * Multipart requests go straight from the browser to the API: documents can be
 * 10 MB each, above what a Vercel function accepts. The staff token goes with them.
 */
export async function postMultipart<T>(path: string, body: FormData): Promise<UploadResult<T>> {
  const { data } = await createClient().auth.getSession();
  const token = data.session?.access_token;
  try {
    const res = await fetch(`${API_URL}/v1${path}`, {
      method: "POST",
      body,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: json.error ?? `Upload failed (${res.status})`, fields: json.fields };
    return { ok: true, data: json as T };
  } catch {
    return { ok: false, error: "Couldn't reach the API. Check your connection and try again." };
  }
}
