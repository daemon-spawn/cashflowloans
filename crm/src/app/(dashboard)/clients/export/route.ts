import type { NextRequest } from "next/server";

import { api } from "@/lib/api";
import { apiPath, clientQuery, sortClients, STANDING_LABELS } from "@/lib/clients";
import { csvResponse } from "@/lib/csv";
import { todaySast } from "@/lib/format";
import type { ClientSummary } from "@/lib/types";

/** The old CRM's "Export CSV", with the same filters as the page. */
export async function GET(request: NextRequest) {
  const query = clientQuery(Object.fromEntries(request.nextUrl.searchParams));
  const { items } = await api<{ items: ClientSummary[] }>(apiPath(query));
  const rows = sortClients(items, query.sort).map((c) => [
    c.fullName,
    c.idNumber,
    c.phone,
    c.email,
    STANDING_LABELS[c.standing],
    c.borrowed,
    c.repaid,
    c.outstanding,
    c.nextDueDate ?? "",
    c.blacklisted ? "Yes" : "No",
    c.createdAt.slice(0, 10),
  ]);
  return csvResponse(`clients-${todaySast()}.csv`, [
    ["Name", "ID number", "Phone", "Email", "Standing", "Borrowed", "Repaid", "Outstanding", "Next due", "Blacklisted", "Created"],
    ...rows,
  ]);
}
