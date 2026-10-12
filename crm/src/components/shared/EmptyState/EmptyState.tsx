export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="bg-background rounded-xl border border-dashed p-12 text-center">
      <p className="font-medium">{title}</p>
      {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
    </div>
  );
}
