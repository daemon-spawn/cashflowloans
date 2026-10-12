import { Container } from "@/components/shared/Container";

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <section data-surface="dark" className="bg-brand-950 text-white">
      <Container className="py-20 sm:py-28">
        <h1 className="text-4xl font-semibold sm:text-5xl">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-lg text-white/80">{description}</p>}
      </Container>
    </section>
  );
}
