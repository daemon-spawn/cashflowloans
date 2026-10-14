import { Search } from "lucide-react";
import { Input } from "@cashflow/ui/components/input";

/** GET form: the query lives in the URL, so searches can be bookmarked and shared. */
export function SearchBox({ defaultValue, placeholder, hidden = {} }: { defaultValue?: string; placeholder: string; hidden?: Record<string, string | undefined> }) {
  return (
    <form role="search" className="relative w-full sm:w-80">
      {Object.entries(hidden).map(([k, v]) => (v ? <input key={k} type="hidden" name={k} value={v} /> : null))}
      <Search aria-hidden className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input name="q" type="search" defaultValue={defaultValue} placeholder={placeholder} aria-label={placeholder} className="bg-card pl-9" />
    </form>
  );
}
