import { APPLICATION_STATUSES, type ApplicationStatus } from "@cashflow/core";

import { EmptyState } from "@/components/shared/EmptyState";

const columnTitles: Record<ApplicationStatus, string> = {
  new: "New",
  in_review: "In review",
  approved: "Approved",
  declined: "Declined",
};

/** Kanban of applications by status. Drag-and-drop (dnd-kit) is added in the CRM build phase. */
export function PipelineBoard() {
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {APPLICATION_STATUSES.map((status) => (
        <section key={status} className="bg-background rounded-xl border p-4">
          <h2 className="mb-3 text-sm font-semibold">{columnTitles[status]}</h2>
          <EmptyState title="No applications" />
        </section>
      ))}
    </div>
  );
}
