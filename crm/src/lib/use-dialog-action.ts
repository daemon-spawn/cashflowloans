"use client";

import { useActionState } from "react";

import { idle, type ActionState } from "@/lib/action-state";

/**
 * useActionState for a form inside a dialog: closes the dialog when the action
 * succeeds. The dialog's content unmounts on close, so the state resets on reopen.
 */
export function useDialogAction(
  action: (state: ActionState, form: FormData) => Promise<ActionState>,
  onSuccess: () => void,
) {
  return useActionState(async (prev: ActionState, form: FormData) => {
    const result = await action(prev, form);
    if (result.ok) onSuccess();
    return result;
  }, idle);
}
