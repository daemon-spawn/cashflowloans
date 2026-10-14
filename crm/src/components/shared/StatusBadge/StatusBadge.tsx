import type { ApplicationStatus, LoanStatus } from "@cashflow/core";
import { cn } from "@cashflow/ui/lib/utils";

const styles: Record<ApplicationStatus | LoanStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  pending_payout: "bg-violet-100 text-violet-800",
  in_review: "bg-amber-100 text-amber-800",
  approved: "bg-brand-100 text-brand-900",
  declined: "bg-neutral-200 text-neutral-700",
  active: "bg-brand-100 text-brand-900",
  due: "bg-amber-100 text-amber-800",
  overdue: "bg-red-100 text-red-800",
  paid: "bg-emerald-100 text-emerald-800",
  written_off: "bg-neutral-200 text-neutral-700",
};

export function StatusBadge({ status }: { status: ApplicationStatus | LoanStatus }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", styles[status])}>
      {status.replace("_", " ")}
    </span>
  );
}
