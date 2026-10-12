import type { Metadata, Viewport } from "next";
import { Onest, Schibsted_Grotesk } from "next/font/google";
import { company } from "@cashflow/core";

import { siteUrl } from "@/lib/site";
import "./globals.css";

// Display: Schibsted Grotesk — sturdy, plain-spoken newspaper grotesque for headings.
// Body: Onest — open, screen-first sans with clear lining figures for Rand amounts and ID numbers.
const display = Schibsted_Grotesk({ variable: "--font-schibsted", subsets: ["latin"], display: "swap" });
const sans = Onest({ variable: "--font-onest", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${company.name} | Short-term loans from R100 to R100,000`,
    template: `%s | ${company.name}`,
  },
  description:
    "Secured and unsecured short-term loans from R100 to R100,000 in South Africa. See what you repay before you apply. Paid within 15 minutes of DebiCheck.",
  openGraph: { type: "website", locale: "en_ZA", siteName: company.name },
};

export const viewport: Viewport = { themeColor: "#0d2a21" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-ZA" className={`${display.variable} ${sans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
