import type { MetadataRoute } from "next";

import { posts } from "@/content/blog";
import { siteUrl } from "@/lib/site";

const routes = ["", "/about", "/how-it-works", "/how-it-works/secured", "/how-it-works/unsecured", "/apply", "/faq", "/contact", "/blog", "/legal/terms", "/legal/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...routes.map((r) => ({ url: `${siteUrl}${r}` })),
    ...posts.map((p) => ({ url: `${siteUrl}/blog/${p.slug}`, lastModified: p.publishedAt })),
  ];
}
