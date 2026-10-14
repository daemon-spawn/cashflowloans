import type { ClientSummary, Standing } from "@/lib/types";

export const STANDING_LABELS: Record<Standing, string> = {
  overdue: "Overdue",
  due: "Due",
  active: "Active",
  pending_payout: "Awaiting payout",
  applicant: "Applying",
  written_off: "Written off",
  paid: "Paid",
  declined: "Declined",
  none: "No loans",
};

export const SORTS = {
  recent: "Newest",
  name: "Name",
  outstanding: "Outstanding",
  due: "Next due date",
  repaid: "Total repaid",
} as const;
export type Sort = keyof typeof SORTS;

export function sortClients(items: ClientSummary[], sort: Sort) {
  const list = [...items];
  switch (sort) {
    case "name":
      return list.sort((a, b) => a.fullName.localeCompare(b.fullName));
    case "outstanding":
      return list.sort((a, b) => Number(b.outstanding) - Number(a.outstanding));
    case "repaid":
      return list.sort((a, b) => Number(b.repaid) - Number(a.repaid));
    case "due":
      return list.sort((a, b) => (a.nextDueDate ?? "9999").localeCompare(b.nextDueDate ?? "9999"));
    default:
      return list; // API order: newest first
  }
}

export function clientQuery(params: Record<string, string | string[] | undefined>) {
  const get = (k: string) => (typeof params[k] === "string" ? (params[k] as string) : undefined);
  const sort = (get("sort") ?? "recent") as Sort;
  return {
    q: get("q"),
    standing: get("standing") as Standing | undefined,
    blacklisted: get("blacklisted") === "true",
    sort: sort in SORTS ? sort : ("recent" as Sort),
  };
}

export function apiPath({ q, standing, blacklisted }: ReturnType<typeof clientQuery>) {
  const p = new URLSearchParams();
  if (q) p.set("q", q);
  if (standing) p.set("standing", standing);
  if (blacklisted) p.set("blacklisted", "true");
  return `/clients?${p}`;
}
