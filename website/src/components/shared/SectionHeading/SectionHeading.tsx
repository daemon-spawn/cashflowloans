import { cn } from "@cashflow/ui/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, align = "left", className }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="text-brand-500 text-sm font-semibold uppercase tracking-widest">{eyebrow}</p>}
      <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">{title}</h2>
      {description && <p className="text-muted-foreground mt-4 text-lg">{description}</p>}
    </div>
  );
}
