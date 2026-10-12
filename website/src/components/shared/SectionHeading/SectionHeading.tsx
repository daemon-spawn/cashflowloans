import { cn } from "@cashflow/ui/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, align = "left", tone = "dark", className }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-[40rem]", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className={cn("t-meta", tone === "dark" ? "text-brand-700" : "text-brand-300")}>{eyebrow}</p>}
      <h2 className="t-h2 mt-3">{title}</h2>
      {description && (
        <p className={cn("t-lead mt-4", tone === "dark" ? "text-muted-foreground" : "text-white/75")}>{description}</p>
      )}
    </div>
  );
}
