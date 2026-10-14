import type { ActionState } from "@/lib/action-state";

/** The result of a server action: the error in red, or the confirmation. */
export function FormMessage({ state }: { state: ActionState }) {
  if (state.error) {
    return (
      <p role="alert" className="text-destructive text-sm">
        {state.error}
      </p>
    );
  }
  if (state.ok && state.message) {
    return (
      <p role="status" className="text-brand-900 text-sm">
        {state.message}
      </p>
    );
  }
  return null;
}

export function FieldError({ state, name }: { state: ActionState; name: string }) {
  const msg = state.fields?.[name]?.[0];
  return msg ? <p className="text-destructive text-xs">{msg}</p> : null;
}
