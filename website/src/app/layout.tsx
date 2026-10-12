import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { company } from "@cashflow/core";

import { siteUrl } from "@/lib/site";
import "./globals.css";

// DM Sans with its optical-size axis: light and tight for display sizes, regular for body.
const dm = DM_Sans({ variable: "--font-dm", subsets: ["latin"], axes: ["opsz"], display: "swap" });

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
    <html lang="en-ZA" className={`${dm.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
