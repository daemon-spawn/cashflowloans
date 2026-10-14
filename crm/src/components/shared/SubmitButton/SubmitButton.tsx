"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@cashflow/ui/components/button";

export function SubmitButton({ children, pendingLabel = "Saving…", ...props }: React.ComponentProps<typeof Button> & { pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || props.disabled} {...props}>
      {pending ? pendingLabel : children}
    </Button>
  );
}
