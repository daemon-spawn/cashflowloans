"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FileText, ImageIcon, Upload } from "lucide-react";
import { DOCUMENT_KINDS } from "@cashflow/core";
import { Button } from "@cashflow/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@cashflow/ui/components/dialog";
import { Input } from "@cashflow/ui/components/input";
import { Label } from "@cashflow/ui/components/label";
import { Select } from "@cashflow/ui/components/select";

import { Panel } from "@/components/shared/Panel";
import { dateTime, humanize } from "@/lib/format";
import type { Document } from "@/lib/types";
import { postMultipart } from "@/lib/upload";

const kindLabel: Record<string, string> = {
  id_document: "ID document",
  payslip: "Payslip",
  bank_statement: "Bank statement",
  collateral_image: "Collateral photo",
  other: "Other",
};

const size = (bytes: number) => (bytes > 1_000_000 ? `${(bytes / 1_000_000).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1000))} KB`);

/** Documents are private: links are signed by the API and expire after 5 minutes, so reload to refresh them. */
export function DocumentsPanel({
  documents,
  uploadPath,
  applicationId,
}: {
  documents: Document[];
  /** e.g. /applications/<id>/documents or /clients/<id>/documents */
  uploadPath: string;
  applicationId?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = new FormData(e.currentTarget);
    if (applicationId) body.set("applicationId", applicationId);
    startTransition(async () => {
      const res = await postMultipart(uploadPath, body);
      if (!res.ok) return setError(res.fields?.file?.[0] ?? res.error);
      setError(undefined);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Panel
      title="Documents"
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Upload className="size-4" aria-hidden /> Upload
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload a document</DialogTitle>
              <DialogDescription>PDF, JPG, PNG or WebP, up to 10 MB. Bank statements must be PDF.</DialogDescription>
            </DialogHeader>
            <form onSubmit={onSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="doc-kind">Type</Label>
                <Select id="doc-kind" name="kind" defaultValue="other">
                  {DOCUMENT_KINDS.map((k) => (
                    <option key={k} value={k}>
                      {kindLabel[k] ?? humanize(k)}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="doc-file">File</Label>
                <Input id="doc-file" name="file" type="file" accept=".pdf,image/*" required />
              </div>
              {error && (
                <p role="alert" className="text-destructive text-sm">
                  {error}
                </p>
              )}
              <DialogFooter>
                <Button type="submit" disabled={pending}>
                  {pending ? "Uploading…" : "Upload"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      {documents.length === 0 ? (
        <p className="text-muted-foreground text-sm">No documents yet.</p>
      ) : (
        <ul className="grid gap-2">
          {documents.map((d) => {
            const Icon = d.contentType.startsWith("image/") ? ImageIcon : FileText;
            const label = (
              <>
                <Icon className="text-brand-900 size-4 shrink-0" aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{kindLabel[d.kind] ?? humanize(d.kind)}</span>
                  <span className="text-muted-foreground block truncate text-xs">
                    {d.filename} · {size(d.sizeBytes)} · {dateTime(d.createdAt)}
                  </span>
                </span>
              </>
            );
            return (
              <li key={d.id}>
                {d.url ? (
                  <a href={d.url} target="_blank" rel="noopener noreferrer" className="hover:bg-muted flex items-center gap-3 rounded-lg border px-3 py-2.5">
                    {label}
                    <span className="text-brand-900 text-xs font-medium">Open</span>
                  </a>
                ) : (
                  <div className="flex items-center gap-3 rounded-lg border px-3 py-2.5" title="Preview needs Supabase Storage">
                    {label}
                    <span className="text-muted-foreground text-xs">Stored</span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
