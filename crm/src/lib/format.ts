import { formatRand } from "@cashflow/core";

/** Money arrives from the API as decimal strings. */
export const rand = (value: string | number | null | undefined) => formatRand(Number(value ?? 0));

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "14 Oct 2026". Hand-rolled so server and browser always agree. */
export function shortDate(iso: string | null | undefined) {
  if (!iso) return "—";
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return `${d} ${months[m - 1]} ${y}`;
}

export function dateTime(iso: string) {
  const d = new Date(iso);
  const sast = new Date(d.getTime() + 2 * 3600_000); // South Africa has no daylight saving
  const hh = String(sast.getUTCHours()).padStart(2, "0");
  const mm = String(sast.getUTCMinutes()).padStart(2, "0");
  return `${shortDate(sast.toISOString())}, ${hh}:${mm}`;
}

/** Whole days from `today` (YYYY-MM-DD) to `iso`; negative when in the past. */
export function daysFrom(today: string, iso: string) {
  return Math.round((Date.parse(iso.slice(0, 10)) - Date.parse(today)) / 86_400_000);
}

export function dueLabel(today: string, iso: string | null) {
  if (!iso) return "—";
  const days = daysFrom(today, iso);
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  if (days > 1) return `Due in ${days} days`;
  return days === -1 ? "1 day overdue" : `${-days} days overdue`;
}

export const humanize = (value: string) => value.replaceAll("_", " ").replace(/^\w/, (c) => c.toUpperCase());

/** Today's date in South Africa as YYYY-MM-DD. */
export function todaySast() {
  return new Date(Date.now() + 2 * 3600_000).toISOString().slice(0, 10);
}

/** "0614011426" → "27614011426" for wa.me links. */
export const whatsappNumber = (phone: string) => phone.replace(/\D/g, "").replace(/^0/, "27");
