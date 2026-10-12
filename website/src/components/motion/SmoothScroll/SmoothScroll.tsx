"use client";

import { useEffect, useRef } from "react";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";

import { gsap, ScrollTrigger } from "@/lib/gsap";

/** Keeps ScrollTrigger positions in sync with Lenis' virtual scroll. */
function ScrollTriggerSync() {
  useLenis(ScrollTrigger.update);
  return null;
}

/**
 * Lenis smooth scrolling driven by GSAP's ticker so ScrollTrigger animations
 * stay in sync. Visitors who prefer reduced motion get native scrolling.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // The Lenis instance is created after mount, so read the ref on every tick.
    const update = (time: number) => {
      const lenis = lenisRef.current?.lenis;
      if (!lenis) return;
      if (reduceMotion) {
        lenis.destroy();
        gsap.ticker.remove(update);
        return;
      }
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false, lerp: 0.1 }}>
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
