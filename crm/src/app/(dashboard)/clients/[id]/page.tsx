import { PageTitle } from "@/components/shared/PageTitle";

export default async function ClientPage({ params }: PageProps<"/clients/[id]">) {
  const { id } = await params;
  return <PageTitle title={`Record ${id}`} />;
}
