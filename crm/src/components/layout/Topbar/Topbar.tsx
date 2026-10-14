import { SignOutButton } from "@/components/auth/SignOutButton";
import { MobileNav } from "@/components/layout/MobileNav";
import type { NavCounts } from "@/components/layout/Sidebar/nav";

export function Topbar({ email, counts }: { email?: string; counts: NavCounts }) {
  return (
    <header className="bg-background/90 sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 backdrop-blur sm:px-6">
      <MobileNav counts={counts} />
      <span className="font-semibold md:hidden">Cashflow CRM</span>
      <div className="ml-auto flex items-center gap-4">
        {email && <span className="text-muted-foreground hidden text-sm sm:inline">{email}</span>}
        <SignOutButton />
      </div>
    </header>
  );
}
