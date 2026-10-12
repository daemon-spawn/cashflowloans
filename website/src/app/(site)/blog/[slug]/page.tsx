import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Container } from "@/components/shared/Container";
import { BlogBody } from "@/components/blog/BlogBody";
import { BlogCard } from "@/components/blog/BlogCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
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
            <Link href="/blog" className="bg-sage text-brand-950 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.8125rem] leading-none font-medium transition-colors hover:bg-white">
              <ArrowLeft className="size-3.5" aria-hidden /> All articles
            </Link>
            <h1 className="t-display animate-rise mt-6 text-[clamp(2.25rem,1.6rem+2.8vw,3.75rem)]">{post.title}</h1>
            <p className="mt-6 text-white/60">
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </p>
          </Container>
        </header>
        <Container className="max-w-4xl">
          <div className="relative -mt-28 aspect-[16/9] overflow-hidden rounded-[2rem]">
            <Image src={post.image} alt={post.imageAlt} fill priority sizes="(min-width: 896px) 896px, 100vw" className="object-cover" />
          </div>
          <div className="mx-auto max-w-[42rem] py-14">
            <BlogBody blocks={post.body} />
          </div>
        </Container>
      </article>
      <section className="pb-20 sm:pb-28">
        <Container>
          <SectionHeading eyebrow="Keep reading" eyebrowHref="/blog" title="More" highlight="articles" />
          <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => <BlogCard key={p.slug} post={p} />)}
          </div>
        </Container>
      </section>
      <CtaBanner />
    </>
  );
}
