/**
 * Canonical site URL. Accepts a bare domain ("cashflowloans.co.za") as well as a
 * full URL, and falls back to Vercel's production domain, so a missing or
 * protocol-less env var can't break the build with "Invalid URL".
 */
function resolveSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    "localhost:3000";
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `${raw.startsWith("localhost") ? "http" : "https"}://${raw}`;
  try {
    return new URL(withProtocol).origin;
  } catch {
    return "http://localhost:3000";
  }
}

export const siteUrl = resolveSiteUrl();

/** Primary navigation — conventional labels, kept short so it never wraps. */
export const navigation = [
  { label: "How it works", href: "/how-it-works" },
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerNavigation = {
  loans: [
    { label: "How it works", href: "/how-it-works" },
    { label: "Unsecured loans", href: "/how-it-works/unsecured" },
    { label: "Secured loans", href: "/how-it-works/secured" },
    { label: "Start your application", href: "/apply" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Terms & Conditions", href: "/legal/terms" },
    { label: "Privacy Policy (POPIA)", href: "/legal/privacy" },
  ],
} as const;

/** The one primary action on every page (design brief, Gate 4). */
export const primaryCta = { label: "Start your application", href: "/apply" } as const;
