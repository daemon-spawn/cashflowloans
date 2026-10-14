"use client";

import { useActionState } from "react";
import { COLLATERAL_STATUSES } from "@cashflow/core";
import { Label } from "@cashflow/ui/components/label";
import { Select } from "@cashflow/ui/components/select";
import { Textarea } from "@cashflow/ui/components/textarea";

import { FormMessage } from "@/components/shared/FormMessage";
import { Panel } from "@/components/shared/Panel";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { idle } from "@/lib/action-state";
import { updateCollateral } from "@/lib/actions";
import { humanize } from "@/lib/format";
import type { Loan } from "@/lib/types";

/** Secured loans: what we hold and where it is (Terms 2.2: sold if the loan isn't repaid). */
export function CollateralForm({ loan }: { loan: Loan }) {
  const [state, action] = useActionState(updateCollateral, idle);
  const settled = loan.status === "paid" && loan.collateralStatus === "held";
  return (
    <Panel title="Collateral" actions={loan.collateralStatus && <StatusBadge status={loan.collateralStatus} />}>
      {settled && (
        <p className="bg-sage text-brand-900 mb-4 rounded-lg px-3 py-2 text-sm">Paid in full: arrange for the item to be returned.</p>
      )}
      <form action={action} className="grid gap-3">
        <input type="hidden" name="loanId" value={loan.id} />
        <div className="grid gap-2">
          <Label htmlFor="collateral-status">Status</Label>
          <Select id="collateral-status" name="status" defaultValue={loan.collateralStatus ?? "awaiting_collection"}>
            {COLLATERAL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {humanize(s)}
              </option>
            ))}
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="collateral-description">Item</Label>
          <Textarea
            id="collateral-description"
            name="description"
            rows={3}
            defaultValue={loan.collateralDescription ?? ""}
            placeholder="e.g. Samsung A54, IMEI …, collected by courier 12 Oct"
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <FormMessage state={state} />
          <SubmitButton size="sm" variant="outline" className="ml-auto">
            Save
          </SubmitButton>
        </div>
      </form>
    </Panel>
  );
}
