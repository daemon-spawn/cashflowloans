import type { Metadata } from "next";

import { MessageList } from "@/components/messages/MessageList";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageTitle } from "@/components/shared/PageTitle";
import { Tabs } from "@/components/shared/Tabs";
import { api } from "@/lib/api";
import type { Message } from "@/lib/types";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage({ searchParams }: PageProps<"/messages">) {
  const { status: raw } = await searchParams;
  const status = raw === "handled" || raw === "all" ? raw : "new";
  const { items } = await api<{ items: Message[] }>("/messages");
  const shown = status === "all" ? items : items.filter((m) => m.status === status);
  const count = (s: string) => items.filter((m) => m.status === s).length;

  return (
    <>
      <PageTitle title="Messages" description="Enquiries from the website contact form." />
      <Tabs
        active={status}
        items={[
          { label: "New", value: "new", href: "/messages", count: count("new") },
          { label: "Handled", value: "handled", href: "/messages?status=handled", count: count("handled") },
          { label: "All", value: "all", href: "/messages?status=all", count: items.length },
        ]}
      />
      {shown.length === 0 ? <EmptyState title={status === "new" ? "All caught up" : "No messages"} /> : <MessageList items={shown} />}
    </>
  );
}
