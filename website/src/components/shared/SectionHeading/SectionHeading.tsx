import { cn } from "@cashflow/ui/lib/utils";

import { Highlight } from "@/components/shared/Highlight";
import { Pill } from "@/components/shared/Pill";

type SectionHeadingProps = {
  eyebrow?: string;
  /** Optional link for the eyebrow pill. */
  eyebrowHref?: string;
  title: string;
  /** Second part of the headline, set in the highlight tone. */
  highlight?: string;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
};

export function SectionHeading({ eyebrow, eyebrowHref, title, highlight, description, align = "left", tone = "dark", className }: SectionHeadingProps) {
  const surface = tone === "dark" ? "light" : "dark";
  return (
    <div className={cn("max-w-[44rem]", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <Pill tone={surface} href={eyebrowHref}>{eyebrow}</Pill>}
      <h2 className={cn("t-h2", eyebrow && "mt-6")}>
        {title}
        {highlight && <> <Highlight tone={surface}>{highlight}</Highlight></>}
      </h2>
      {description && (
        <p className={cn("t-lead mt-5 max-w-[38rem]", tone === "dark" ? "text-muted-foreground" : "text-white/75")}>{description}</p>
      )}
    </div>
  );
}
