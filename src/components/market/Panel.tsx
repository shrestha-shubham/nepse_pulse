import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[3px] border border-line bg-surface shadow-[0_8px_24px_oklch(0_0_0_/_0.1)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function PanelHeader({
  title,
  meta,
  actions,
}: {
  title: string;
  meta?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-elev/30 px-4 py-3 sm:px-5">
      <div className="min-w-0">
        <h2 className="text-[13px] font-semibold tracking-tight text-ink">{title}</h2>
        {meta ? <p className="mt-1 truncate text-[11px] leading-4 text-muted">{meta}</p> : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}

export function Stat({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: "up" | "down" | "flat" | "neutral";
}) {
  const toneClass =
    tone === "up"
      ? "text-up"
      : tone === "down"
        ? "text-down"
        : tone === "flat"
          ? "text-flat"
          : "text-ink";
  return (
    <div className="flex min-h-[112px] flex-col justify-center bg-surface px-4 py-5 sm:px-5">
      <div className="label-xs text-muted">{label}</div>
      <div
        className={cn(
          "mt-2 font-mono text-[1.35rem] font-semibold leading-none tracking-tight sm:text-2xl",
          toneClass,
        )}
      >
        {value}
      </div>
      {sub ? <div className="mt-2 font-mono text-[11px] leading-4 text-faint">{sub}</div> : null}
    </div>
  );
}

export function StatGrid({ children, cols = 4 }: { children: ReactNode; cols?: 3 | 4 | 5 }) {
  return (
    <section
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-[3px] border border-line bg-line",
        cols === 3 && "md:grid-cols-3",
        cols === 4 && "md:grid-cols-4",
        cols === 5 && "md:grid-cols-3 xl:grid-cols-5",
      )}
    >
      {children}
    </section>
  );
}
