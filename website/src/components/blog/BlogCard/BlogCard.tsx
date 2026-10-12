import Image from "next/image";
import Link from "next/link";

import type { BlogPost } from "@/content/blog";
import { formatDate } from "@/lib/format-date";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[3/2] overflow-hidden rounded-xl">
        <Image
          src={post.image}
          alt={post.imageAlt}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      </div>
      <p className="t-meta text-muted-foreground mt-5">
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      </p>
      <h3 className="t-h3 mt-2 text-[1.3125rem]">
        <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
          {post.title}
        </Link>
      </h3>
      <p className="text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
    </article>
  );
}
