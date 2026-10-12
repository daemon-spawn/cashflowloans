import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { posts } from "@/content/blog";

export const metadata: Metadata = { title: "Blog" };

export default function BlogPage() {
  return (
    <>
      <PageHeader title="Money matters" description="Practical guides to borrowing and managing money well." />
      <Container className="grid gap-6 py-20 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="hover:border-primary rounded-2xl border p-6">
            <h2 className="font-semibold">{post.title}</h2>
          </Link>
        ))}
      </Container>
    </>
  );
}
