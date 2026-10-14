import "server-only";

import { createClient } from "@/lib/supabase/server";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly fields?: Record<string, string[]>,
  ) {
    super(message);
  }
}

/**
 * Server-side call to the Flask API, authenticated with the signed-in staff
 * member's Supabase access token. The API verifies the token and the staff allowlist.
 */
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const isJson = init.body !== undefined && typeof init.body === "string";
  const res = await fetch(`${API_URL}/v1${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      ...(isJson ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string; fields?: Record<string, string[]> };
    throw new ApiError(body.error ?? `Request failed (${res.status})`, res.status, body.fields);
  }
  return res.json() as Promise<T>;
}
