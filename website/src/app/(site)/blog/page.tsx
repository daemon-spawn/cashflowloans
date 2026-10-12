import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/shared/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { BlogCard } from "@/components/blog/BlogCard";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { getPosts } from "@/lib/content";
import { formatDate } from "@/lib/format-date";

export const metadata: Metadata = {
  title: "Blog",
  description: "Practical guides to borrowing and managing money well, from Cashflow Loans.",
};

export default async function BlogPage() {
  const [featured, ...posts] = await getPosts();
  return (
    <>
      <PageHeader eyebrow="Our Blog" title="Money" highlight="matters." description="Practical guides to borrowing and managing money well." />
      <section className="py-14 sm:py-20">
        <Container>
          {featured && (
            <article className="bg-card group relative grid overflow-hidden rounded-[2rem] md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
              <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[24rem]">
                <Image src={featured.image} alt={featured.imageAlt} fill priority sizes="(min-width: 768px) 52vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none" />
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-12">
                <p className="text-muted-foreground text-sm">
                  Latest · <time dateTime={featured.publishedAt}>{formatDate(featured.publishedAt)}</time>
                </p>
                <h2 className="t-h2 mt-4 text-[clamp(1.875rem,1.5rem+1.4vw,2.75rem)]">
                  <Link href={`/blog/${featured.slug}`} className="after:absolute after:inset-0 group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                    {featured.title}
                  </Link>
                </h2>
                <p className="text-muted-foreground mt-4 line-clamp-3">{featured.excerpt}</p>
                <span className="text-brand-900 mt-8 inline-flex items-center gap-2 font-medium">
                  Read article <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </div>
            </article>
          )}
          <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => <BlogCard key={post.slug} post={post} />)}
          </div>
        </Container>
      </section>
      <CtaBanner />
    </>
  );
}
