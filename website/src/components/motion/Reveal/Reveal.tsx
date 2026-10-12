"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Animate direct children one after another instead of as one block. */
  stagger?: number;
  delay?: number;
  y?: number;
};

/** Fades content up as it scrolls into view. */
export function Reveal({ children, className, stagger, delay = 0, y = 32 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from(stagger ? el.children : el, {
        y,
        autoAlpha: 0,
        duration: 0.9,
        delay,
        stagger,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
