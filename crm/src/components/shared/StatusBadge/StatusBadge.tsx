import type { ApplicationStatus, CollateralStatus, LoanStatus } from "@cashflow/core";
import { cn } from "@cashflow/ui/lib/utils";

import type { Standing } from "@/lib/types";

type Status = ApplicationStatus | LoanStatus | CollateralStatus | Standing | "handled" | "blacklisted";

const styles: Partial<Record<Status, string>> = {
  new: "bg-sky-100 text-sky-900",
  in_review: "bg-amber-100 text-amber-900",
  approved: "bg-sage text-brand-900",
  declined: "bg-neutral-200 text-neutral-700",
  pending_payout: "bg-violet-100 text-violet-900",
  active: "bg-sage text-brand-900",
  due: "bg-amber-100 text-amber-900",
  overdue: "bg-red-100 text-red-900",
  paid: "bg-emerald-100 text-emerald-900",
  written_off: "bg-neutral-200 text-neutral-700",
  applicant: "bg-sky-100 text-sky-900",
  none: "bg-neutral-100 text-neutral-600",
  awaiting_collection: "bg-amber-100 text-amber-900",
  held: "bg-sage text-brand-900",
  returned: "bg-emerald-100 text-emerald-900",
  sold: "bg-neutral-200 text-neutral-700",
  handled: "bg-neutral-100 text-neutral-600",
  blacklisted: "bg-red-700 text-white",
};

const labels: Partial<Record<Status, string>> = {
  pending_payout: "Awaiting payout",
  in_review: "In review",
  written_off: "Written off",
  awaiting_collection: "Awaiting collection",
  none: "No loans",
  applicant: "Applying",
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <span className={cn("inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap", styles[status], className)}>
      {labels[status] ?? status.charAt(0).toUpperCase() + status.slice(1).replaceAll("_", " ")}
    </span>
  );
}
