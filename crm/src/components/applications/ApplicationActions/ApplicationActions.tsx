"use client";

import { useState, useTransition } from "react";
import type { ApplicationStatus } from "@cashflow/core";
import { Button } from "@cashflow/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@cashflow/ui/components/dialog";
import { Label } from "@cashflow/ui/components/label";
import { Textarea } from "@cashflow/ui/components/textarea";

import { setApplicationStatus } from "@/lib/actions";
import type { Application } from "@/lib/types";

/** The buttons for moving one application through review. Same rules as the board. */
export function ApplicationActions({ app, loanPaidOut }: { app: Application; loanPaidOut: boolean }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string>();
  const [declineOpen, setDeclineOpen] = useState(false);
  const [overrideOpen, setOverrideOpen] = useState(false);

  function go(status: ApplicationStatus, options: { declineReason?: string; override?: boolean } = {}) {
    setError(undefined);
    startTransition(async () => {
      const res = await setApplicationStatus(app.id, status, options);
      if (res.needsOverride) return setOverrideOpen(true);
      if (!res.ok) setError(res.error);
    });
  }

  if (loanPaidOut) return null; // the loan page takes over from here

  return (
    <div className="flex flex-wrap items-center gap-2">
      {app.status === "new" && (
        <Button variant="outline" disabled={pending} onClick={() => go("in_review")}>
          Start review
        </Button>
      )}
      {(app.status === "new" || app.status === "in_review") && (
        <>
          <Button variant="outline" disabled={pending} onClick={() => setDeclineOpen(true)}>
            Decline
          </Button>
          <Button disabled={pending} onClick={() => go("approved")}>
            Approve
          </Button>
        </>
      )}
      {app.status === "approved" && (
        <Button variant="outline" disabled={pending} onClick={() => go("in_review")}>
          Undo approval
        </Button>
      )}
      {app.status === "declined" && (
        <Button variant="outline" disabled={pending} onClick={() => go("in_review")}>
          Reopen
        </Button>
      )}
      {error && (
        <p role="alert" className="text-destructive w-full text-sm">
          {error}
        </p>
      )}

      <Dialog open={declineOpen} onOpenChange={setDeclineOpen}>
        <DialogContent>
          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              go("declined", { declineReason: String(new FormData(e.currentTarget).get("reason") ?? "") });
              setDeclineOpen(false);
            }}
          >
            <DialogHeader>
              <DialogTitle>Decline {app.client.fullName}?</DialogTitle>
              <DialogDescription>They&apos;ll get a polite email. The application stays on record with your reason.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason (for the team, not sent to the applicant)</Label>
              <Textarea id="reason" name="reason" rows={3} />
            </div>
            <DialogFooter>
              <Button type="submit" variant="destructive">
                Decline
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={overrideOpen} onOpenChange={setOverrideOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{app.client.fullName} is blacklisted</DialogTitle>
            <DialogDescription>
              {app.client.blacklistReason ? `Reason: ${app.client.blacklistReason}. ` : ""}Approve this application anyway?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOverrideOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setOverrideOpen(false);
                go("approved", { override: true });
              }}
            >
              Approve anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
