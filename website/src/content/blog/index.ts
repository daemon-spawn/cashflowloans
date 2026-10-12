/**
 * Blog posts migrated from legacy/src/blog/*.html (text kept as published,
 * images as used on the original homepage). These files seed the CRM-managed
 * content later; until then they are the source of truth.
 */
import financialResponsibilities from "./posts/financial-responsibilities.json";
import debtConsolidation from "./posts/debt-consolidation.json";
import howToChoosePersonalLoan from "./posts/how-to-choose-personal-loan.json";
import personalVsPaydayLoans from "./posts/personal-vs-payday-loans.json";
import unsecuredVsSecuredLoans from "./posts/unsecured-vs-secured-loans.json";
import personalVsCreditCards from "./posts/personal-vs-credit-cards.json";
import avoidDebtSpiral from "./posts/avoid-debt-spiral.json";
import needsVsWants from "./posts/needs-vs-wants.json";

export type BlogBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; ordered: boolean; items: string[] };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  image: string;
  imageAlt: string;
  tags: string[];
  body: BlogBlock[];
};

/** Order matches the original homepage, followed by the two footer articles. */
export const posts = [
  financialResponsibilities,
  debtConsolidation,
  howToChoosePersonalLoan,
  personalVsPaydayLoans,
  unsecuredVsSecuredLoans,
  personalVsCreditCards,
  avoidDebtSpiral,
  needsVsWants,
] as BlogPost[];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
