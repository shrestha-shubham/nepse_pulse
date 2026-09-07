import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function LoadingBlock({ className, rows = 5 }: { className?: string; rows?: number }) {
  return (
    <div className={cn("space-y-2 p-4", className)} role="status" aria-label="Loading data">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-8 animate-pulse rounded-[3px] bg-elev"
          style={{ opacity: 1 - i * 0.12 }}
        />
      ))}
    </div>
  );
}

export function ChartSkeleton({ height = 280 }: { height?: number }) {
  return (
    <div
      className="m-4 animate-pulse rounded-[3px] bg-elev"
      style={{ height }}
      role="status"
      aria-label="Loading chart"
    />
  );
}

export function StateMessage({
  title,
  description,
  action,
  tone = "neutral",
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  tone?: "neutral" | "error";
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
      <div
        className={cn(
          "font-mono text-[10px] uppercase tracking-[0.18em]",
          tone === "error" ? "text-down" : "text-faint",
        )}
      >
        {tone === "error" ? "Error" : "No data"}
      </div>
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      {description ? <p className="max-w-sm text-[13px] text-muted">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

export function RetryButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[3px] border border-line bg-elev px-3 py-1.5 font-mono text-xs text-ink transition-colors hover:border-brand/60"
    >
      Try again
    </button>
  );
}
