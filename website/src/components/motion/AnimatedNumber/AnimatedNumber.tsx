"use client";

import { useEffect, useRef } from "react";

import { gsap } from "@/lib/gsap";

type Props = { value: number; format: (n: number) => string; className?: string };

/**
 * Tweens to each new value so the change reads as feedback. The server and
 * first client render show the exact value, so there is no hydration mismatch.
 */
export function AnimatedNumber({ value, format, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const current = useRef(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      current.current = value;
      el.textContent = format(value);
      return;
    }
    const state = { n: current.current };
    const tween = gsap.to(state, {
      n: value,
      duration: 0.45,
      ease: "power2.out",
      onUpdate: () => {
        current.current = state.n;
        el.textContent = format(Math.round(state.n));
      },
    });
    return () => {
      tween.kill();
    };
  }, [value, format]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
