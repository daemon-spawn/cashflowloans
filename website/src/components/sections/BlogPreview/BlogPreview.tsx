import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BlogCard } from "@/components/blog/BlogCard";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import type { BlogPost } from "@/content/blog";

export function BlogPreview({ posts }: { posts: readonly BlogPost[] }) {
  return (
    <section className="pb-20 sm:pb-28">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="From the blog" title="Money matters," highlight="explained plainly" />
          <Link href="/blog" className="text-brand-900 group inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline">
            All articles
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
        <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => <BlogCard key={post.slug} post={post} />)}
        </div>
      </Container>
    </section>
  );
}
