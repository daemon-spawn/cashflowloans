import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Container } from "@/components/shared/Container";
import { BlogBody } from "@/components/blog/BlogBody";
import { BlogCard } from "@/components/blog/BlogCard";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { getPost, getPosts } from "@/lib/content";
import { formatDate } from "@/lib/format-date";

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt, openGraph: { images: [post.image] } };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  const related = (await getPosts()).filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <article>
        <header data-surface="dark" className="bg-brand-950 text-white">
          <Container className="max-w-4xl pt-14 pb-40 sm:pt-20">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
              <ArrowLeft className="size-4" aria-hidden /> All articles
            </Link>
            <p className="t-meta text-gold mt-8">
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </p>
            <h1 className="t-h2 mt-3 text-[clamp(2rem,1.4rem+2.6vw,3.25rem)]">{post.title}</h1>
          </Container>
        </header>
        <Container className="max-w-4xl">
          <div className="relative -mt-28 aspect-[16/9] overflow-hidden rounded-xl">
            <Image src={post.image} alt={post.imageAlt} fill priority sizes="(min-width: 896px) 896px, 100vw" className="object-cover" />
          </div>
          <div className="mx-auto max-w-[42rem] py-14">
            <BlogBody blocks={post.body} />
          </div>
        </Container>
      </article>
      <section className="border-border border-t py-16">
        <Container>
          <h2 className="t-h3 text-[1.5rem]">More articles</h2>
          <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => <BlogCard key={p.slug} post={p} />)}
          </div>
        </Container>
      </section>
      <CtaBanner />
    </>
  );
}
