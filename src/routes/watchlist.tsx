import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader } from "@/components/market/Panel";
import { LoadingBlock, StateMessage } from "@/components/market/States";
import { useQuotes } from "@/hooks/useMarketData";
import { useWatchlist } from "@/hooks/useWatchlist";
import {
  formatClock,
  formatPercent,
  formatPrice,
  formatSigned,
  toneOf,
  toneTextClass,
} from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/watchlist")({
  head: () => ({
    meta: [
      { title: "Watchlist — Track NEPSE Stocks | Meridian" },
      {
        name: "description",
        content:
          "Keep a personal watchlist of NEPSE listed companies with price, daily change and last update, saved in your browser.",
      },
      { property: "og:title", content: "Watchlist — Track NEPSE Stocks" },
      {
        property: "og:description",
        content: "A personal NEPSE watchlist stored locally in your browser.",
      },
    ],
  }),
  component: WatchlistPage,
});

function WatchlistPage() {
  const { symbols, ready, remove, clear } = useWatchlist();
  const { data, isPending } = useQuotes();
  const rows = (data ?? []).filter((q) => symbols.includes(q.symbol));

  return (
    <AppShell
      title="Watchlist"
      tag="Local"
      subtitle="Saved in this browser only · demonstration dataset"
    >
      <Panel>
        <PanelHeader
          title="Tracked companies"
          meta={`${rows.length} symbol(s) saved`}
          actions={
            rows.length > 0 ? (
              <button
                type="button"
                onClick={clear}
                className="rounded-[3px] border border-line bg-surface px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-faint transition-colors hover:border-down/60 hover:text-down"
              >
                Clear all
              </button>
            ) : null
          }
        />        {rows.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2 border-b border-line px-4 pb-3 pt-1">
            <span className="rounded-[3px] border border-line bg-elev px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
              Saved: {rows.length}
            </span>
            <span className="rounded-[3px] border border-line bg-elev px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-up">
              Gainers: {rows.filter((q) => q.changePercent >= 0).length}
            </span>
            <span className="rounded-[3px] border border-line bg-elev px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-down">
              Losers: {rows.filter((q) => q.changePercent < 0).length}
            </span>
          </div>
        )}        {rows.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2 border-b border-line px-4 pb-3 pt-1">
            <span className="rounded-[3px] border border-line bg-elev px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
              Saved: {rows.length}
            </span>
            <span className="rounded-[3px] border border-line bg-elev px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-up">
              Gainers: {rows.filter((q) => q.changePercent >= 0).length}
            </span>
            <span className="rounded-[3px] border border-line bg-elev px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-down">
              Losers: {rows.filter((q) => q.changePercent < 0).length}
            </span>
          </div>
        )}
        {!ready || isPending ? (
          <LoadingBlock rows={4} />
        ) : rows.length === 0 ? (
          <StateMessage
            title="Your watchlist is empty"
            description="Open any company and use “Add to watchlist” to start tracking it here."
            action={
              <Link
                to="/stocks"
                className="rounded-[3px] border border-line bg-elev px-3 py-1.5 font-mono text-xs text-ink hover:border-brand/60"
              >
                Browse stocks
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-line text-left font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                  <th className="px-4 py-2 font-medium sm:px-5">Company</th>
                  <th className="px-4 py-2 text-right font-medium">Price</th>
                  <th className="px-4 py-2 text-right font-medium">Change</th>
                  <th className="px-4 py-2 text-right font-medium">Change %</th>
                  <th className="px-4 py-2 text-right font-medium">Last updated</th>
                  <th className="px-4 py-2 sm:px-5">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((q) => (
                  <tr key={q.symbol} className="group transition-colors hover:bg-elev">
                    <td className="px-4 py-2.5 sm:px-5">
                      <Link to="/stocks/$symbol" params={{ symbol: q.symbol }} className="block">
                        <div className="font-mono text-xs font-medium text-ink group-hover:text-brand">
                          {q.symbol}
                        </div>
                        <div className="truncate text-[11px] text-faint">{q.name}</div>
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs text-ink">
                      {formatPrice(q.price)}
                    </td>
                    <td
                      className={cn(
                        "px-4 py-2.5 text-right font-mono text-xs",
                        toneTextClass[toneOf(q.change)],
                      )}
                    >
                      {formatSigned(q.change)}
                    </td>
                    <td
                      className={cn(
                        "px-4 py-2.5 text-right font-mono text-xs",
                        toneTextClass[toneOf(q.changePercent)],
                      )}
                    >
                      {formatPercent(q.changePercent)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-[11px] text-faint">
                      {formatClock(q.updatedAt)} UTC
                    </td>
                    <td className="px-4 py-2.5 text-right sm:px-5">
                      <button
                        type="button"
                        onClick={() => remove(q.symbol)}
                        aria-label={`Remove ${q.symbol} from watchlist`}
                        className="rounded-[3px] border border-line px-2 py-1 font-mono text-[11px] text-faint transition-colors hover:border-down/60 hover:text-down"
                      >
                        Remove
                      </button>
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
