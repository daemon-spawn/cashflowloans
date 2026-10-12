export type Step = { title: string; description: string };

/** A real sequence, so each step carries an oversized numeral. */
export function StepList({ steps }: { steps: readonly Step[] }) {
  return (
    <ol>
      {steps.map((step, i) => (
        <li key={step.title} className="border-brand-900/15 grid grid-cols-[5.5rem_minmax(0,1fr)] items-start gap-6 border-t py-9 sm:grid-cols-[8rem_minmax(0,1fr)]">
          <span className="t-numeral text-brand-900 text-[clamp(3.5rem,2.8rem+2.4vw,5.5rem)]">{String(i + 1).padStart(2, "0")}</span>
          <div className="pt-2">
            <h3 className="t-h3 text-[1.5rem]">{step.title}</h3>
            <p className="text-ink/70 mt-2 max-w-[42ch]">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
