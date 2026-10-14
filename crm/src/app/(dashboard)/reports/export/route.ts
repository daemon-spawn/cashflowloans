import type { NextRequest } from "next/server";

import { api } from "@/lib/api";
import { csvResponse } from "@/lib/csv";
import { timeframeOf } from "@/lib/reports";
import { todaySast } from "@/lib/format";
import type { Analytics } from "@/lib/types";

export async function GET(request: NextRequest) {
  const timeframe = timeframeOf(request.nextUrl.searchParams.get("timeframe"));
  const a = await api<Analytics>(`/reports/analytics?timeframe=${timeframe}`);
  return csvResponse(`client-report-${timeframe}-${todaySast()}.csv`, [
    ["Rank", "Client", "Total loaned", "Total repaid", "Outstanding", "Profit", "Last activity"],
    ...a.topClients.map((c, i) => [i + 1, c.name, c.loaned, c.repaid, c.outstanding, c.profit, c.lastActivity ?? ""]),
  ]);
}
