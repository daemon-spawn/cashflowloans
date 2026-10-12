import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { getPost, posts } from "@/content/blog";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = getPost((await params).slug);
  return { title: post?.title };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  return (
    <>
      <PageHeader title={post.title} />
      <Container className="max-w-3xl py-20">
        {/* Article body is migrated from legacy/src/blog during the redesign. */}
      </Container>
    </>
  );
}
