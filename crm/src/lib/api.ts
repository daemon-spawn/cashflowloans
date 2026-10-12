import "server-only";

import { createClient } from "@/lib/supabase/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

/**
 * Server-side call to the Flask API, authenticated with the signed-in staff
 * member's Supabase access token. The API verifies the token and the staff allowlist.
 */
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const res = await fetch(`${API_URL}/v1${path}`, {
    ...init,
    cache: "no-store",
    headers: { ...init.headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}
