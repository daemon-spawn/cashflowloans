export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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
