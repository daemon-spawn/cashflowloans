import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

import "./globals.css";

// Same type system as the website (see website/src/app/layout.tsx).
const dm = DM_Sans({ variable: "--font-dm", subsets: ["latin"], axes: ["opsz"] });

export const metadata: Metadata = {
  title: { default: "Cashflow CRM", template: "%s · Cashflow CRM" },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-ZA" className={`${dm.variable} h-full antialiased`}>
      <body className="bg-muted/40 min-h-full font-sans">{children}</body>
    </html>
  );
}
