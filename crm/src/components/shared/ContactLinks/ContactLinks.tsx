import { Mail, MessageCircle, Phone } from "lucide-react";
import { cn } from "@cashflow/ui/lib/utils";

import { whatsappNumber } from "@/lib/format";

const btn = "hover:bg-muted inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium";

/** One-tap call, WhatsApp and email: how the team actually chases payments. */
export function ContactLinks({ phone, email, message, className }: { phone: string; email?: string; message?: string; className?: string }) {
  const wa = `https://wa.me/${whatsappNumber(phone)}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <a className={btn} href={`tel:${phone}`}>
        <Phone className="size-3.5" aria-hidden /> Call
      </a>
      <a className={btn} href={wa} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="size-3.5" aria-hidden /> WhatsApp
      </a>
      {email && (
        <a className={btn} href={`mailto:${email}`}>
          <Mail className="size-3.5" aria-hidden /> Email
        </a>
      )}
    </div>
  );
}
