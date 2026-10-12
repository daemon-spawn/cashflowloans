import type { Metadata } from "next";
import { Onest, Schibsted_Grotesk } from "next/font/google";

import "./globals.css";

// Same type system as the website (see website/src/app/layout.tsx).
const display = Schibsted_Grotesk({ variable: "--font-schibsted", subsets: ["latin"] });
const sans = Onest({ variable: "--font-onest", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Cashflow CRM", template: "%s · Cashflow CRM" },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-ZA" className={`${display.variable} ${sans.variable} h-full antialiased`}>
      <body className="bg-muted/40 min-h-full font-sans">{children}</body>
    </html>
  );
}
