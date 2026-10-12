import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { company } from "@cashflow/core";

import { siteUrl } from "@/lib/site";
import "./globals.css";

const sans = Geist({ variable: "--font-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${company.name} — Fast secured & unsecured loans`,
    template: `%s | ${company.name}`,
  },
  description:
    "Fast secured and unsecured personal loans from R100 to R100,000 in South Africa. Transparent terms, quick approvals.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-ZA" className={`${sans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
