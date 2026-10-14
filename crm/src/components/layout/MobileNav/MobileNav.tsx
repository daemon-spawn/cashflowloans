"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@cashflow/ui/components/dialog";

import { NavLinks } from "@/components/layout/Sidebar/NavLinks";
import type { NavCounts } from "@/components/layout/Sidebar/nav";

export function MobileNav({ counts }: { counts: NavCounts }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="hover:bg-muted -ml-2 rounded-md p-2 md:hidden" aria-label="Open menu">
        <Menu className="size-5" aria-hidden />
      </DialogTrigger>
      <DialogContent
        data-surface="dark"
        aria-describedby={undefined}
        className="bg-brand-950 top-0 left-0 h-dvh max-h-dvh w-72 max-w-[85vw] translate-x-0 translate-y-0 content-start rounded-none border-0 text-white"
      >
        <DialogTitle className="sr-only">Menu</DialogTitle>
        <Image src="/logo-horizontal.png" alt="Cashflow Loans" width={1139} height={200} className="mb-4 h-7 w-auto" />
        <nav aria-label="CRM">
          <NavLinks counts={counts} onNavigate={() => setOpen(false)} />
        </nav>
      </DialogContent>
    </Dialog>
  );
}
