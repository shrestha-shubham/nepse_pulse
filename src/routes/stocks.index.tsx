import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader } from "@/components/market/Panel";
import { LoadingBlock, RetryButton, StateMessage } from "@/components/market/States";
import { useQuotes } from "@/hooks/useMarketData";
import { SECTORS } from "@/services/marketData";
import {
  formatCompactNpr,
  formatPercent,
  formatPrice,
  formatSigned,
  groupNepali,
  toneOf,
  toneTextClass,
} from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/stocks/")({
  head: () => ({
    meta: [
      { title: "Stock Directory — NEPSE Listed Companies | Meridian" },
      {
        name: "description",
        content:
          "Search and filter NEPSE listed companies by sector, price, change, volume and turnover in a responsive stock directory.",
      },
      { property: "og:title", content: "Stock Directory — NEPSE Listed Companies" },
      {
        property: "og:description",
        content: "Searchable, sortable directory of NEPSE listed companies with demonstration data.",
      },
    ],
  }),
  component: StocksPage,
});

type SortKey = "symbol" | "price" | "changePercent" | "volume" | "turnover";

const COLUMNS: { key: SortKey | null; label: string; align?: "right" }[] = [
  { key: "symbol", label: "Symbol" },
  { key: null, label: "Company" },
  { key: null, label: "Sector" },
  { key: "price", label: "Last price", align: "right" },
  { key: null, label: "Change", align: "right" },
  { key: "changePercent", label: "Change %", align: "right" },
  { key: "volume", label: "Volume", align: "right" },
  { key: "turnover", label: "Turnover", align: "right" },
];

function StocksPage() {
  const { data, isPending, isError, refetch } = useQuotes();
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState<string>("All");
  const [sort, setSort] = useState<SortKey>("turnover");
  const [dir, setDir] = useState<"asc" | "desc">("desc");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = (data ?? []).filter(
      (s) =>
        (sector === "All" || s.sector === sector) &&
        (q === "" || s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)),
    );
    return filtered.sort((a, b) => {
      const av = a[sort];
      const bv = b[sort];
      const cmp = typeof av === "string" ? av.localeCompare(bv as string) : (av as number) - (bv as number);
      return dir === "asc" ? cmp : -cmp;
    });
  }, [data, query, sector, sort, dir]);

  const toggleSort = (key: SortKey) => {
    if (key === sort) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSort(key);
      setDir(key === "symbol" ? "asc" : "desc");
    }
  };

  return (
    <AppShell
      title="Stocks"
      tag="Directory"
      subtitle={`${rows.length} of ${(data ?? []).length} listed companies · demonstration dataset`}
    >
      <Panel>
        <PanelHeader
          title="Listed companies"
          meta="Search by symbol or name, filter by sector, sort any numeric column"
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search symbol or company…"
                className="h-8 w-48 rounded-[3px] border border-line bg-canvas px-2.5 text-sm text-ink outline-none placeholder:text-faint focus:border-brand/60"
              />
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="h-8 rounded-[3px] border border-line bg-canvas px-2 text-sm text-ink outline-none focus:border-brand/60"
              >
                <option value="All">All sectors</option>
                {SECTORS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          }
        />

        {isPending ? (
          <LoadingBlock rows={8} />
        ) : isError ? (
          <StateMessage
            tone="error"
            title="Could not load the stock directory"
            description="The market data service did not respond."
            action={<RetryButton onClick={() => refetch()} />}
          />
        ) : rows.length === 0 ? (
          <StateMessage
            title="No companies match your filters"
            description="Try a different symbol, company name or sector."
            action={
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSector("All");
                }}
                className="rounded-[3px] border border-line bg-elev px-3 py-1.5 font-mono text-xs text-ink hover:border-brand/60"
              >
                Clear filters
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-sm">
              <thead>
                <tr className="border-b border-line text-left font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                  {COLUMNS.map((c) => (
                    <th
                      key={c.label}
                      className={cn("px-4 py-2 font-medium", c.align === "right" && "text-right")}
                    >
                      {c.key ? (
                        <button
                          type="button"
                          onClick={() => toggleSort(c.key as SortKey)}
                          className={cn(
                            "transition-colors hover:text-ink",
                            sort === c.key && "text-brand",
                          )}
                        >
                          {c.label}
                          {sort === c.key ? (dir === "asc" ? " ↑" : " ↓") : ""}
                        </button>
                      ) : (
                        c.label
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((s) => (
                  <tr key={s.symbol} className="group transition-colors hover:bg-elev">
                    <td className="px-4 py-2.5 font-mono text-xs font-medium">
                      <Link
                        to="/stocks/$symbol"
                        params={{ symbol: s.symbol }}
                        className="text-ink group-hover:text-brand"
                      >
                        {s.symbol}
                      </Link>
                    </td>
                    <td className="max-w-[220px] truncate px-4 py-2.5 text-[13px] text-muted">
                      {s.name}
                    </td>
                    <td className="px-4 py-2.5 text-[12px] text-faint">{s.sector}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs text-ink">
                      {formatPrice(s.price)}
                    </td>
                    <td
                      className={cn(
                        "px-4 py-2.5 text-right font-mono text-xs",
                        toneTextClass[toneOf(s.change)],
                      )}
                    >
                      {formatSigned(s.change)}
                    </td>
                    <td
                      className={cn(
                        "px-4 py-2.5 text-right font-mono text-xs",
                        toneTextClass[toneOf(s.changePercent)],
                      )}
                    >
                      {formatPercent(s.changePercent)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs text-muted">
                      {groupNepali(s.volume)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs text-muted">
                      Rs. {formatCompactNpr(s.turnover)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </AppShell>
  );
}
