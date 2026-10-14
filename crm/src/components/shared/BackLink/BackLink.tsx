import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-muted-foreground hover:text-foreground mb-3 inline-flex items-center gap-1.5 text-sm">
      <ArrowLeft className="size-4" aria-hidden /> {children}
    </Link>
  );
}
