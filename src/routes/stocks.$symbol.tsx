import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader, Stat, StatGrid } from "@/components/market/Panel";
import { PriceChart } from "@/components/market/PriceChart";
import { RangeTabs } from "@/components/market/RangeTabs";
import { ChartSkeleton, LoadingBlock, RetryButton, StateMessage } from "@/components/market/States";
import { useCompanyProfile, usePriceHistory, useQuote } from "@/hooks/useMarketData";
import { useWatchlist } from "@/hooks/useWatchlist";
import type { Range } from "@/services/marketData";
import {
  formatCompactNpr,
  formatPercent,
  formatPrice,
  formatSigned,
  groupNepali,
  toneOf,
} from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/stocks/$symbol")({
  head: ({ params }) => {
    const symbol = params.symbol.toUpperCase();
    return {
      meta: [
        { title: `${symbol} Stock Details — NEPSE | Meridian` },
        {
          name: "description",
          content: `Price, daily change, 52-week range, volume, turnover, market capitalisation and historical chart for ${symbol} on NEPSE. Demonstration data.`,
        },
        { property: "og:title", content: `${symbol} Stock Details — NEPSE` },
        {
          property: "og:description",
          content: `Key statistics and historical price chart for ${symbol}.`,
        },
      ],
    };
  },
  component: StockDetail,
});

function KeyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-line px-4 py-2.5 last:border-0 sm:px-5">
      <span className="text-[13px] text-muted">{label}</span>
      <span className="font-mono text-xs text-ink">{value}</span>
    </div>
  );
}

function StockDetail() {
  const { symbol } = Route.useParams();
  const [range, setRange] = useState<Range>("3M");
  const quote = useQuote(symbol);
  const history = usePriceHistory(symbol, range);
  const profile = useCompanyProfile(symbol);
  const { has, toggle, ready } = useWatchlist();

  const q = quote.data;
  const saved = ready && q ? has(q.symbol) : false;

  if (quote.isError) {
    return (
      <AppShell title={symbol.toUpperCase()} subtitle="Symbol not found">
        <Panel>
          <StateMessage
            tone="error"
            title={`No listed company for “${symbol.toUpperCase()}”`}
            description="This symbol is not part of the demonstration dataset."
            action={
              <Link
                to="/stocks"
                className="rounded-[3px] border border-line bg-elev px-3 py-1.5 font-mono text-xs text-ink hover:border-brand/60"
              >
                Back to directory
              </Link>
            }
          />
        </Panel>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={q ? `${q.symbol} · ${q.name}` : symbol.toUpperCase()}
      tag={q?.sector}
      subtitle={q ? `Last close ${formatPrice(q.price)} · demonstration dataset` : "Loading company…"}
      actions={
        q ? (
          <button
            type="button"
            onClick={() => toggle(q.symbol)}
            className={cn(
              "h-9 rounded-[3px] border px-3 font-mono text-xs transition-colors",
              saved
                ? "border-brand/60 bg-elev text-brand"
                : "border-line bg-surface text-muted hover:border-brand/50 hover:text-ink",
            )}
          >
            {saved ? "★ In watchlist" : "+ Add to watchlist"}
          </button>
        ) : null
      }
    >
      {!q ? (
        <Panel>
          <LoadingBlock rows={5} />
        </Panel>
      ) : (
        <>
          <StatGrid cols={5}>
            <Stat
              label="Last price"
              value={formatPrice(q.price)}
              sub={`${formatSigned(q.change)} (${formatPercent(q.changePercent)})`}
              tone={toneOf(q.change)}
            />
            <Stat label="52-week high" value={formatPrice(q.high52)} sub="Simulated range" />
            <Stat label="52-week low" value={formatPrice(q.low52)} sub="Simulated range" />
            <Stat label="Volume" value={groupNepali(q.volume)} sub={`Turnover Rs. ${formatCompactNpr(q.turnover)}`} />
            <Stat label="Market cap" value={`Rs. ${formatCompactNpr(q.marketCap)}`} sub={`${groupNepali(q.listedShares)} listed shares`} />
          </StatGrid>

          <Panel>
            <PanelHeader
              title="Price history"
              meta={`${q.symbol} · ${range} simulated series`}
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
              <PriceChart data={history.data} range={range} positive={q.change >= 0} height={330} />
            )}
          </Panel>

          <div className="grid gap-5 lg:grid-cols-2">
            <Panel>
              <PanelHeader title="Company information" meta={q.sector} />
              {profile.isPending ? (
                <LoadingBlock rows={3} />
              ) : profile.isError || !profile.data ? (
                <StateMessage
                  tone="error"
                  title="Profile unavailable"
                  action={<RetryButton onClick={() => profile.refetch()} />}
                />
              ) : (
                <>
                  <p className="border-b border-line px-4 py-4 text-[13px] leading-relaxed text-muted sm:px-5">
                    {profile.data.description}
                  </p>
                  <KeyRow label="Listed on" value={profile.data.listedOn} />
                  <KeyRow
                    label="Paid-up capital"
                    value={`Rs. ${formatCompactNpr(profile.data.paidUpCapital)}`}
                  />
                </>
              )}
            </Panel>

            <Panel>
              <PanelHeader title="Key statistics" meta="Derived from the demonstration dataset" />
              <KeyRow label="Previous close" value={formatPrice(q.previousClose)} />
              <KeyRow label="Day range" value={`${formatPrice(q.dayLow)} – ${formatPrice(q.dayHigh)}`} />
              {profile.data ? (
                <>
                  <KeyRow label="EPS" value={formatPrice(profile.data.eps)} />
                  <KeyRow label="P/E ratio" value={formatPrice(profile.data.peRatio)} />
                  <KeyRow label="Book value" value={formatPrice(profile.data.bookValue)} />
                  <KeyRow label="Dividend yield" value={`${profile.data.dividendYield.toFixed(2)}%`} />
                </>
              ) : null}
            </Panel>
          </div>
        </>
      )}
    </AppShell>
  );
}
