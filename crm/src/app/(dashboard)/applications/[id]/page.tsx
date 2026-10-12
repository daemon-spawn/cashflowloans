import { PageTitle } from "@/components/shared/PageTitle";

export default async function ApplicationPage({ params }: PageProps<"/applications/[id]">) {
  const { id } = await params;
  return <PageTitle title={`Record ${id}`} />;
}
