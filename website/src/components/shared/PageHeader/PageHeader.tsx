import Image, { type StaticImageData } from "next/image";

import { cn } from "@cashflow/ui/lib/utils";

import { Container } from "@/components/shared/Container";
import { Highlight } from "@/components/shared/Highlight";
import { Pill } from "@/components/shared/Pill";

type PageHeaderProps = {
  eyebrow?: string;
  eyebrowHref?: string;
  title: string;
  /** Second part of the headline, set in the highlight tone. */
  highlight?: string;
  description?: React.ReactNode;
  /** Real photo shown beside the headline on large screens, below it on phones. */
  image?: StaticImageData;
  imageAlt?: string;
  /** CSS object-position for the photo, to keep faces in the crop. */
  imagePosition?: string;
  /** Buttons or other actions under the description. */
  children?: React.ReactNode;
  className?: string;
};

/** Deep-green opening for every inner page: pill, two-tone headline, optional photo. */
export function PageHeader({ eyebrow, eyebrowHref, title, highlight, description, image, imageAlt = "", imagePosition, children, className }: PageHeaderProps) {
  return (
    <section data-surface="dark" className={cn("bg-brand-950 text-white", className)}>
      <Container className={cn("grid gap-10 pt-14 pb-16 sm:pt-20 sm:pb-20", image && "lg:grid-cols-12 lg:items-end lg:gap-x-14")}>
        <div className={cn(image ? "lg:col-span-7 lg:pb-4" : "max-w-[50rem]")}>
          {eyebrow && (
            <div className="animate-rise">
              <Pill tone="dark" href={eyebrowHref}>{eyebrow}</Pill>
            </div>
          )}
          <h1 className={cn("t-display animate-rise [animation-delay:80ms]", eyebrow && "mt-6")}>
            {title}
            {highlight && <> <Highlight tone="dark">{highlight}</Highlight></>}
          </h1>
          {description && <div className="t-lead animate-rise mt-6 max-w-[36rem] text-white/75 [animation-delay:160ms]">{description}</div>}
          {children && <div className="animate-rise mt-8 flex flex-wrap items-center gap-3 [animation-delay:240ms]">{children}</div>}
        </div>
        {image && (
          <div className="animate-rise relative aspect-[4/3] overflow-hidden rounded-[1.75rem] [animation-delay:200ms] lg:col-span-5 lg:aspect-[4/5]">
            <Image src={image} alt={imageAlt} fill priority placeholder="blur" sizes="(min-width: 1024px) 38vw, 100vw" className="object-cover" style={imagePosition ? { objectPosition: imagePosition } : undefined} />
          </div>
        )}
      </Container>
    </section>
  );
}
