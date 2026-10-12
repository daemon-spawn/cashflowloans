import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { BlogCard } from "@/components/blog/BlogCard";
import { getPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "Practical guides to borrowing and managing money well, from Cashflow Loans.",
};

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <>
      <PageHeader title="Money matters" description="Practical guides to borrowing and managing money well." />
      <Container className="grid gap-x-8 gap-y-14 py-20 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => <BlogCard key={post.slug} post={post} />)}
      </Container>
    </>
  );
}
