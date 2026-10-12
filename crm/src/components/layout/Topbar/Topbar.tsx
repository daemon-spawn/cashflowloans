import { SignOutButton } from "@/components/auth/SignOutButton";

export function Topbar({ email }: { email?: string }) {
  return (
    <header className="bg-background flex h-14 items-center justify-end gap-4 border-b px-6">
      {email && <span className="text-muted-foreground text-sm">{email}</span>}
      <SignOutButton />
    </header>
  );
}
