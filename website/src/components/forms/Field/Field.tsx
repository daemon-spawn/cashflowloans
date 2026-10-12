import { Label } from "@cashflow/ui/components/label";
import { cn } from "@cashflow/ui/lib/utils";

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
};

/** Label + control + hint/error, wired up for screen readers via ids. */
export function Field({ id, label, error, hint, className, children }: FieldProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-destructive text-sm">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-muted-foreground text-sm">{hint}</p>
      ) : null}
    </div>
  );
}
