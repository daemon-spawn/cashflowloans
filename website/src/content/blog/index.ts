/**
 * Blog registry. Articles are migrated from legacy/src/blog/*.html during the
 * redesign; each post lives in its own module next to this file.
 */
export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
};

export const posts: readonly BlogPost[] = [
  { slug: "financial-responsibilities", title: "The basics of financial responsibility", excerpt: "", publishedAt: "2025-08-07" },
  { slug: "debt-consolidation", title: "When to take out a debt consolidation loan", excerpt: "", publishedAt: "2025-08-07" },
  { slug: "how-to-choose-personal-loan", title: "How to choose a personal loan", excerpt: "", publishedAt: "2025-08-07" },
  { slug: "personal-vs-payday-loans", title: "Personal loans vs payday loans", excerpt: "", publishedAt: "2025-08-07" },
  { slug: "unsecured-vs-secured-loans", title: "Unsecured vs secured loans", excerpt: "", publishedAt: "2025-08-07" },
  { slug: "personal-vs-credit-cards", title: "Personal loans vs credit cards", excerpt: "", publishedAt: "2025-08-07" },
  { slug: "avoid-debt-spiral", title: "How to avoid the debt spiral", excerpt: "", publishedAt: "2025-08-07" },
  { slug: "needs-vs-wants", title: "Needs vs wants", excerpt: "", publishedAt: "2025-08-07" },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
