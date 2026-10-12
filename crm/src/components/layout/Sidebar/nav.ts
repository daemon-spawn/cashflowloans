import { FileText, Inbox, LayoutDashboard, Settings, Users, Wallet } from "lucide-react";

export const sidebarNav = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Applications", href: "/applications", icon: FileText },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Loans", href: "/loans", icon: Wallet },
  { label: "Messages", href: "/messages", icon: Inbox },
  { label: "Settings", href: "/settings", icon: Settings },
] as const;
