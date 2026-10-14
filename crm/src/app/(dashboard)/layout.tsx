import { redirect } from "next/navigation";

import { Sidebar } from "@/components/layout/Sidebar";
import type { NavCounts } from "@/components/layout/Sidebar/nav";
import { Topbar } from "@/components/layout/Topbar";
import { api } from "@/lib/api";
import { createClient } from "@/lib/supabase/server";
import type { Overview } from "@/lib/types";

async function navCounts(): Promise<NavCounts> {
  try {
    const o = await api<Overview>("/reports/overview");
    return {
      applications: o.applications.new + o.applications.inReview + o.totals.pendingPayout,
      loans: o.totals.overdueLoans,
      messages: o.messagesNew,
    };
  } catch {
    return {}; // the page itself shows the API error
  }
}

export default async function DashboardLayout({ children }: LayoutProps<"/">) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/login");
  const counts = await navCounts();

  return (
    <div className="flex min-h-screen">
      <Sidebar counts={counts} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar email={data.claims.email as string | undefined} counts={counts} />
        <main className="mx-auto w-full max-w-[90rem] flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
