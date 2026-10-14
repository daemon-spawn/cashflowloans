import { Panel } from "@/components/shared/Panel";
import { dateTime } from "@/lib/format";
import type { Activity } from "@/lib/types";

/** The audit trail: every status change, payout, payment and edit, with who did it. */
export function ActivityList({ items, title = "History" }: { items: Activity[]; title?: string }) {
  return (
    <Panel title={title}>
      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">Nothing yet.</p>
      ) : (
        <ol className="relative grid gap-4 border-l pl-5">
          {items.map((a) => (
            <li key={a.id} className="relative">
              <span aria-hidden className="bg-brand-900 absolute top-1.5 -left-[1.5625rem] size-2 rounded-full ring-4 ring-white" />
              <p className="text-sm">{a.message}</p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {a.actor} · {dateTime(a.createdAt)}
              </p>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  );
}
