import { BarChart3, FileText, Inbox, LayoutDashboard, Settings, Users, Wallet } from "lucide-react";

export type NavCounts = { applications?: number; loans?: number; messages?: number };

export const sidebarNav = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Applications", href: "/applications", icon: FileText, count: "applications" },
  { label: "Loans", href: "/loans", icon: Wallet, count: "loans" },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Messages", href: "/messages", icon: Inbox, count: "messages" },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
] as const satisfies readonly { label: string; href: string; icon: unknown; count?: keyof NavCounts }[];
