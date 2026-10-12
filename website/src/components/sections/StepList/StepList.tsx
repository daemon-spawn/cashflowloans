export type Step = { title: string; description: string };

export function StepList({ steps }: { steps: readonly Step[] }) {
  return (
    <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, i) => (
        <li key={step.title} className="rounded-2xl border p-6">
          <span className="bg-sage text-brand-900 grid size-10 place-items-center rounded-full font-semibold">{i + 1}</span>
          <h3 className="mt-4 font-semibold">{step.title}</h3>
          <p className="text-muted-foreground mt-2 text-sm">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
