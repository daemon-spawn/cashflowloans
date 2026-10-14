"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { APPLICATION_STATUSES, type ApplicationStatus } from "@cashflow/core";
import { Button } from "@cashflow/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@cashflow/ui/components/dialog";
import { Label } from "@cashflow/ui/components/label";
import { Textarea } from "@cashflow/ui/components/textarea";
import { cn } from "@cashflow/ui/lib/utils";

import { StatusBadge } from "@/components/shared/StatusBadge";
import { setApplicationStatus } from "@/lib/actions";
import { humanize, rand, shortDate } from "@/lib/format";
import type { Application } from "@/lib/types";

const columns: Record<ApplicationStatus, { title: string; hint: string }> = {
  new: { title: "New", hint: "Just arrived" },
  in_review: { title: "In review", hint: "Checking documents" },
  approved: { title: "Approved", hint: "Loan created" },
  declined: { title: "Declined", hint: "Kept with the reason" },
};

/** Declined applications pile up; the board shows the latest few, the list shows them all. */
const DECLINED_ON_BOARD = 15;

type Pending = { app: Application; to: ApplicationStatus } | null;

/**
 * Releasing a dragged card fires a click on the link under the pointer, which would open
 * the application. A dialog may be opening at that moment, so React's handler can't be
 * relied on: block that one click natively, in the capture phase.
 */
function swallowNextClick() {
  const swallow = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  window.addEventListener("click", swallow, { capture: true, once: true });
  setTimeout(() => window.removeEventListener("click", swallow, { capture: true }), 150);
}

export function PipelineBoard({ applications }: { applications: Application[] }) {
  const [items, setItems] = useState(applications);
  const [error, setError] = useState<string>();
  const [declining, setDeclining] = useState<Pending>(null);
  const [override, setOverride] = useState<Pending>(null);
  const [, startTransition] = useTransition();

  // The server is the source of truth: take its list whenever it changes (after an action refreshes).
  const [synced, setSynced] = useState(applications);
  if (synced !== applications) {
    setSynced(applications);
    setItems(applications);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const byStatus = useMemo(() => {
    const groups = Object.fromEntries(APPLICATION_STATUSES.map((s) => [s, [] as Application[]])) as Record<ApplicationStatus, Application[]>;
    for (const a of items) groups[a.status].push(a);
    return groups;
  }, [items]);

  function move(app: Application, to: ApplicationStatus, options: { declineReason?: string; override?: boolean } = {}) {
    const before = items;
    setItems((list) => list.map((a) => (a.id === app.id ? { ...a, status: to } : a)));
    setError(undefined);
    startTransition(async () => {
      const res = await setApplicationStatus(app.id, to, options);
      if (res.ok) return;
      setItems(before);
      if (res.needsOverride) return setOverride({ app, to });
      setError(`${app.client.fullName}: ${res.error}`);
    });
  }

  function onDragEnd(e: DragEndEvent) {
    swallowNextClick();
    const app = items.find((a) => a.id === e.active.id);
    const to = e.over?.id as ApplicationStatus | undefined;
    if (!app || !to || app.status === to) return;
    if (to === "declined") return setDeclining({ app, to });
    move(app, to);
  }

  return (
    <>
      {error && (
        <p role="alert" className="border-destructive/30 bg-destructive/5 text-destructive mb-4 rounded-lg border px-4 py-3 text-sm">
          {error}
        </p>
      )}
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="grid gap-4 lg:grid-cols-4">
          {APPLICATION_STATUSES.map((status) => {
            const list = byStatus[status];
            const shown = status === "declined" ? list.slice(0, DECLINED_ON_BOARD) : list;
            return (
              <Column key={status} status={status} count={list.length} total={list.reduce((s, a) => s + Number(a.amount), 0)}>
                {shown.map((a) => (
                  <Card key={a.id} app={a} />
                ))}
                {list.length > shown.length && (
                  <Link href="/applications?view=list&status=declined" className="text-brand-900 block py-2 text-center text-sm font-medium">
                    See all {list.length} declined
                  </Link>
                )}
              </Column>
            );
          })}
        </div>
      </DndContext>
      <p className="text-muted-foreground mt-4 text-xs">
        Drag a card to move it. Approving creates the loan, ready to mark as paid out. On a phone, press and hold a card first.
      </p>

      <Dialog open={declining !== null} onOpenChange={(o) => !o && setDeclining(null)}>
        <DialogContent>
          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!declining) return;
              const reason = String(new FormData(e.currentTarget).get("reason") ?? "");
              move(declining.app, "declined", { declineReason: reason });
              setDeclining(null);
            }}
          >
            <DialogHeader>
              <DialogTitle>Decline {declining?.app.client.fullName}?</DialogTitle>
              <DialogDescription>They&apos;ll get a polite email. The application stays on record with your reason.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              <Label htmlFor="decline-reason">Reason (for the team, not sent to the applicant)</Label>
              <Textarea id="decline-reason" name="reason" rows={3} placeholder="e.g. Payslip doesn't cover the repayment" />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setDeclining(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive">
                Decline
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={override !== null} onOpenChange={(o) => !o && setOverride(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{override?.app.client.fullName} is blacklisted</DialogTitle>
            <DialogDescription>
              {override?.app.client.blacklistReason ? `Reason: ${override.app.client.blacklistReason}. ` : ""}
              Approve this application anyway?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOverride(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (override) move(override.app, override.to, { override: true });
                setOverride(null);
              }}
            >
              Approve anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Column({ status, count, total, children }: { status: ApplicationStatus; count: number; total: number; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return (
    <section
      ref={setNodeRef}
      aria-label={columns[status].title}
      className={cn("bg-muted/60 flex min-h-40 flex-col rounded-xl border p-3 transition-colors", isOver && "border-brand-900 bg-sage/60")}
    >
      <header className="mb-3 px-1">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">
            {columns[status].title} <span className="text-muted-foreground font-normal">· {count}</span>
          </h2>
          <span className="text-muted-foreground text-xs tabular-nums">{rand(total)}</span>
        </div>
        <p className="text-muted-foreground text-xs">{columns[status].hint}</p>
      </header>
      <div className="grid gap-2">{children}</div>
    </section>
  );
}

function Card({ app }: { app: Application }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: app.id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
  return (
    <article
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      aria-roledescription="Draggable application"
      className={cn(
        "bg-card relative cursor-grab touch-manipulation rounded-lg border p-3 shadow-xs active:cursor-grabbing",
        isDragging && "z-10 shadow-lg ring-2 ring-[var(--brand-900)]",
        app.client.blacklisted && "border-red-300",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/applications/${app.id}`}
          className="min-w-0 font-medium after:absolute after:inset-0 hover:underline"
        >
          <span className="block truncate">{app.client.fullName}</span>
        </Link>
        <span className="font-semibold tabular-nums">{rand(app.amount)}</span>
      </div>
      <p className="text-muted-foreground mt-1 text-xs">
        <span className="capitalize">{app.loanType}</span> · {app.reference}
      </p>
      <div className="text-muted-foreground mt-1.5 flex flex-wrap items-center gap-1.5 text-xs">
        <span>{shortDate(app.createdAt)}</span>
        {app.source !== "website" && <span className="bg-muted rounded px-1.5 py-0.5">{humanize(app.source)}</span>}
        {app.client.blacklisted && <StatusBadge status="blacklisted" />}
      </div>
    </article>
  );
}
