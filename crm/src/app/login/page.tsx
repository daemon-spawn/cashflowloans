import type { Metadata } from "next";
import Image from "next/image";

import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main data-surface="dark" className="bg-brand-950 grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-sm">
        <Image src="/logo-horizontal.png" alt="Cashflow Loans" width={1139} height={200} priority className="mx-auto mb-8 h-9 w-auto" />
        {/* The card is a light surface again, so focus rings go back to money green. */}
        <div data-surface="light" className="bg-card text-card-foreground rounded-2xl p-7 shadow-xl [--focus:var(--brand-900)]">
          <h1 className="text-xl font-semibold">Staff sign in</h1>
          <p className="text-muted-foreground mt-1 mb-6 text-sm">Cashflow CRM is for the Cashflow Loans team only.</p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
