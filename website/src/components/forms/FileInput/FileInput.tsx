"use client";

import { Input } from "@cashflow/ui/components/input";

import { Field } from "@/components/forms/Field";

export const MAX_FILE_BYTES = 10 * 1024 * 1024;

type FileInputProps = {
  id: string;
  label: string;
  accept: string;
  multiple?: boolean;
  hint?: string;
  error?: string;
  onFiles: (files: File[]) => void;
};

export function FileInput({ id, label, accept, multiple, hint, error, onFiles }: FileInputProps) {
  return (
    <Field id={id} label={label} hint={hint ?? "PDF, JPG or PNG, up to 10 MB each"} error={error}>
      <Input
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        aria-invalid={!!error}
        onChange={(e) => onFiles(Array.from(e.target.files ?? []))}
      />
    </Field>
  );
}
