import type { Metadata } from "next";
import { Geist } from "next/font/google";

import "./globals.css";

const sans = Geist({ variable: "--font-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Cashflow CRM", template: "%s · Cashflow CRM" },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-ZA" className={`${sans.variable} h-full antialiased`}>
      <body className="bg-muted/40 min-h-full font-sans">{children}</body>
    </html>
  );
}
