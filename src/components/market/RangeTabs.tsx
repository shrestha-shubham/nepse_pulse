import type { Range } from "@/services/marketData";
import { cn } from "@/lib/utils";

const RANGES: Range[] = ["1D", "1W", "1M", "3M", "6M", "1Y"];

export function RangeTabs({ value, onChange }: { value: Range; onChange: (r: Range) => void }) {
  return (
    <div className="flex gap-px overflow-hidden rounded-[3px] border border-line bg-line">
      {RANGES.map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => onChange(r)}
          className={cn(
            "bg-surface px-2.5 py-1 font-mono text-[11px] transition-colors hover:bg-elev",
            r === value ? "bg-elev text-brand" : "text-faint",
          )}
        >
          {r}
        </button>
      ))}
    </div>
  );
}
