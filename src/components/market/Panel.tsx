import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <section className={cn("rounded-[4px] border border-line bg-surface", className)}>
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
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
      <div>
        <h2 className="text-sm font-semibold">{title}</h2>
        {meta ? <p className="mt-0.5 text-[11px] text-faint">{meta}</p> : null}
      </div>
      {actions}
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
    <div className="bg-surface p-4">
      <div className="label-xs">{label}</div>
      <div className={cn("mt-2 font-mono text-2xl font-semibold tracking-tight", toneClass)}>
        {value}
      </div>
      {sub ? <div className="font-mono text-xs text-faint">{sub}</div> : null}
    </div>
  );
}

export function StatGrid({ children, cols = 4 }: { children: ReactNode; cols?: 3 | 4 | 5 }) {
  return (
    <section
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-[4px] border border-line bg-line",
        cols === 3 && "md:grid-cols-3",
        cols === 4 && "md:grid-cols-4",
        cols === 5 && "md:grid-cols-3 xl:grid-cols-5",
      )}
    >
      {children}
    </section>
  );
}
