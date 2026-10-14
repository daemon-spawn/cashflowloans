import { cn } from "@cashflow/ui/lib/utils";

export function DetailList({ items, className }: { items: [string, React.ReactNode][]; className?: string }) {
  return (
    <dl className={cn("grid gap-x-6 gap-y-3 text-sm sm:grid-cols-[auto_1fr]", className)}>
      {items.map(([label, value]) => (
        <div key={label} className="contents">
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="font-medium break-words">{value ?? "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
