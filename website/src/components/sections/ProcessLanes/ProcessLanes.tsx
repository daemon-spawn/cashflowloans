"use client";

import { useRef } from "react";

import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./ProcessLanes.module.css";

const lanes = [
  {
    name: "Unsecured",
    steps: [
      { title: "Apply online", detail: "About 5 minutes on your phone" },
      { title: "Upload documents", detail: "ID, payslip, bank statement" },
      { title: "Approval by email", detail: "We review and confirm" },
      { title: "Approve DebiCheck", detail: "Money in your account within 15 minutes" },
    ],
  },
  {
    name: "Secured",
    steps: [
      { title: "Apply online", detail: "About 5 minutes on your phone" },
      { title: "Share your collateral", detail: "Photos of your item or papers" },
      { title: "Free collection", detail: "Our courier collects, nationwide" },
      { title: "Inspection & payout", detail: "Paid to your bank account" },
    ],
  },
];

/**
 * The one orchestrated motion moment on the homepage: each lane's line draws
 * as it enters the screen and the steps light up in order. Static without JS
 * or with reduced motion.
 */
export function ProcessLanes() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      for (const lane of gsap.utils.toArray<HTMLElement>("[data-lane]")) {
        const tl = gsap.timeline({ scrollTrigger: { trigger: lane, start: "top 80%", once: true } });
        tl.from(lane.querySelector("[data-line]"), { scaleX: 0, scaleY: 0, duration: 1, ease: "power2.inOut" }).from(
          lane.querySelectorAll("[data-step]"),
          { autoAlpha: 0.25, y: 12, duration: 0.5, stagger: 0.18, ease: "power2.out" },
          0.1,
        );
      }
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-brand-50 py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="How it works" title="From application to money in your account" description="The steps are the same whether you apply on the website, on WhatsApp or by phone." />
        <div className="mt-14 grid gap-14">
          {lanes.map((lane) => (
            <div key={lane.name} data-lane className={styles.lane}>
              <h3 className="t-meta text-brand-900">{lane.name}</h3>
              <ol className={styles.steps}>
                <span data-line aria-hidden className={styles.line} />
                {lane.steps.map((s, i) => (
                  <li key={s.title} data-step className={styles.step}>
                    <span className={styles.node} aria-hidden>{i + 1}</span>
                    <div>
                      <p className="font-semibold">{s.title}</p>
                      <p className="text-muted-foreground text-[0.9375rem]">{s.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
