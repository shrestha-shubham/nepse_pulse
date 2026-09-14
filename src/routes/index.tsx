import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader, Stat, StatGrid } from "@/components/market/Panel";
import { PriceChart } from "@/components/market/PriceChart";
import { RangeTabs } from "@/components/market/RangeTabs";
import { MoveList, TurnoverList } from "@/components/market/QuoteRow";
import { ChartSkeleton, LoadingBlock, RetryButton, StateMessage } from "@/components/market/States";
import {
  useIndexHistory,
  useMarketSummary,
  useQuotes,
  useRecentTrades,
} from "@/hooks/useMarketData";
import type { Range } from "@/services/marketData";
import {
  formatClock,
  formatCompactNpr,
  formatDateLabel,
  formatPercent,
  formatPrice,
  formatSigned,
  groupNepali,
  toneOf,
  toneTextClass,
} from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEPSE Market Overview — Meridian Dashboard" },
      {
        name: "description",
        content:
          "Track the NEPSE index, turnover, market breadth, top gainers and losers on a clean analytics dashboard built with demonstration data.",
      },
      { property: "og:title", content: "NEPSE Market Overview — Meridian Dashboard" },
      {
        property: "og:description",
        content: "NEPSE index, turnover, breadth, gainers and losers in one analytics view.",
      },
    ],
  }),
  component: MarketOverview,
});

function MarketOverview() {
  const [range, setRange] = useState<Range>("1M");
  const summary = useMarketSummary();
  const history = useIndexHistory(range);
  const quotes = useQuotes();
  const trades = useRecentTrades();

  const list = quotes.data ?? [];
  const gainers = [...list].sort((a, b) => b.changePercent - a.changePercent).slice(0, 6);
  const losers = [...list].sort((a, b) => a.changePercent - b.changePercent).slice(0, 6);
  const traded = [...list].sort((a, b) => b.turnover - a.turnover).slice(0, 6);
  const s = summary.data;
  const tone = s ? toneOf(s.change) : "flat";

  return (
    <AppShell
      title="Market Overview"
      tag="NEPSE"
      subtitle={
        s ? `Session close ${formatDateLabel(s.asOf)} · demonstration dataset` : "Loading session…"
      }
    >
      {summary.isError ? (
        <Panel>
          <StateMessage
            tone="error"
            title="Market summary unavailable"
            description="The data service did not respond. Try again."
            action={<RetryButton onClick={() => summary.refetch()} />}
          />
        </Panel>
      ) : !s ? (
        <Panel>
          <LoadingBlock rows={4} />
        </Panel>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)]">
            <Panel className="overflow-hidden">
              <div className="border-b border-line px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="label-xs">NEPSE Index</div>
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                    <span className={`size-1.5 rounded-full ${s.isLive ? "bg-up" : "bg-flat"}`} />
                    {s.isLive ? "Market open" : "Market closed"}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-end justify-between gap-x-5 gap-y-3">
                  <div className="font-mono text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                    {formatPrice(s.index)}
                  </div>
                  <div className={`font-mono text-sm ${toneTextClass[tone]}`}>
                    {formatSigned(s.change)} ({formatPercent(s.changePercent)})
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 px-5 py-3 text-[11px] text-faint">
                <span>Session close</span>
                <span className="font-mono">{formatDateLabel(s.asOf)}</span>
              </div>
            </Panel>

            <StatGrid cols={3}>
              <Stat
                label="Turnover"
                value={`Rs. ${formatCompactNpr(s.turnover)}`}
                sub="Total value traded"
              />
              <Stat
                label="Traded shares"
                value={formatCompactNpr(s.tradedShares)}
                sub={`${groupNepali(s.transactions)} transactions`}
              />
              <Stat
                label="Market breadth"
                value={
                  <span className="flex items-baseline gap-1.5 text-xl">
                    <span className="text-up">{s.advancing}</span>
                    <span className="text-faint">/</span>
                    <span className="text-down">{s.declining}</span>
                    <span className="text-faint">/</span>
                    <span className="text-flat">{s.unchanged}</span>
                  </span>
                }
                sub="Advancing / declining / unchanged"
              />
            </StatGrid>
          </div>

          <Panel>
            <PanelHeader
              title="NEPSE index history"
              meta="Simulated series for the selected range"
              actions={<RangeTabs value={range} onChange={setRange} />}
            />
            {history.isPending ? (
              <ChartSkeleton />
            ) : history.isError || !history.data?.length ? (
              <StateMessage
                tone="error"
                title="Chart data unavailable"
                action={<RetryButton onClick={() => history.refetch()} />}
              />
            ) : (
              <PriceChart data={history.data} range={range} positive={s.change >= 0} height={320} />
            )}
          </Panel>

          <div className="grid items-stretch gap-4 lg:grid-cols-3">
            <Panel className="h-full overflow-hidden">
              <PanelHeader title="Top gainers" meta="Largest daily percentage rise" />
              {quotes.isPending ? (
                <LoadingBlock />
              ) : quotes.isError ? (
                <StateMessage
                  tone="error"
                  title="Gainers unavailable"
                  description="The quote service did not respond."
                  action={<RetryButton onClick={() => quotes.refetch()} />}
                />
              ) : (
                <MoveList quotes={gainers} empty="No advancing stocks." />
              )}
            </Panel>
            <Panel className="h-full overflow-hidden">
              <PanelHeader title="Top losers" meta="Largest daily percentage fall" />
              {quotes.isPending ? (
                <LoadingBlock />
              ) : quotes.isError ? (
                <StateMessage
                  tone="error"
                  title="Losers unavailable"
                  description="The quote service did not respond."
                  action={<RetryButton onClick={() => quotes.refetch()} />}
                />
              ) : (
                <MoveList quotes={losers} empty="No declining stocks." />
              )}
            </Panel>
            <Panel className="h-full overflow-hidden">
              <PanelHeader title="Most traded" meta="Ranked by turnover" />
              {quotes.isPending ? (
                <LoadingBlock />
              ) : quotes.isError ? (
                <StateMessage
                  tone="error"
                  title="Trading leaders unavailable"
                  description="The quote service did not respond."
                  action={<RetryButton onClick={() => quotes.refetch()} />}
                />
              ) : (
                <TurnoverList quotes={traded} />
              )}
            </Panel>
          </div>

          <Panel>
            <PanelHeader title="Recent market activity" meta="Latest simulated trade prints" />
            {trades.isPending ? (
              <LoadingBlock />
            ) : trades.isError ? (
              <StateMessage
                tone="error"
                title="Activity feed unavailable"
                action={<RetryButton onClick={() => trades.refetch()} />}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr className="border-b border-line text-left font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                      <th className="px-4 py-2 font-medium sm:px-5">Time</th>
                      <th className="px-4 py-2 font-medium">Symbol</th>
                      <th className="px-4 py-2 text-right font-medium">Price</th>
                      <th className="px-4 py-2 text-right font-medium">Change %</th>
                      <th className="px-4 py-2 text-right font-medium sm:px-5">Volume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line font-mono text-xs">
                    {(trades.data ?? []).map((t) => (
                      <tr key={`${t.symbol}-${t.time}`} className="transition-colors hover:bg-elev">
                        <td className="px-4 py-2.5 text-faint sm:px-5">{formatClock(t.time)}</td>
                        <td className="px-4 py-2.5 text-ink">{t.symbol}</td>
                        <td className="px-4 py-2.5 text-right text-ink">{formatPrice(t.price)}</td>
                        <td
                          className={`px-4 py-2.5 text-right ${toneTextClass[toneOf(t.changePercent)]}`}
                        >
                          {formatPercent(t.changePercent)}
                        </td>
                        <td className="px-4 py-2.5 text-right text-muted sm:px-5">
                          {groupNepali(t.volume)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </>
      )}
    </AppShell>
  );
}
