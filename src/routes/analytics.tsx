import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader, Stat, StatGrid } from "@/components/market/Panel";
import { PriceChart } from "@/components/market/PriceChart";
import { RangeTabs } from "@/components/market/RangeTabs";
import { ChartSkeleton, LoadingBlock, RetryButton, StateMessage } from "@/components/market/States";
import {
  useIndexHistory,
  useMarketSummary,
  useQuotes,
  useSectorPerformance,
} from "@/hooks/useMarketData";
import type { Range } from "@/services/marketData";
import { formatCompactNpr, formatPercent, formatShortDate } from "@/lib/format";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Market Analytics — Sector & Breadth Trends | Meridian" },
      {
        name: "description",
        content:
          "Analyse NEPSE sector performance, market breadth, turnover and volume trends alongside historical index performance.",
      },
      { property: "og:title", content: "Market Analytics — Sector & Breadth Trends" },
      {
        property: "og:description",
        content: "Sector performance, breadth, turnover and volume trends for NEPSE.",
      },
    ],
  }),
  component: AnalyticsPage,
});

const axisTick = { fill: "var(--faint)", fontSize: 11 };
const tooltipStyle = {
  background: "var(--elev)",
  border: "1px solid var(--line)",
  borderRadius: 3,
  fontSize: 12,
};

function AnalyticsPage() {
  const [range, setRange] = useState<Range>("6M");
  const sectors = useSectorPerformance();
  const summary = useMarketSummary();
  const history = useIndexHistory(range);
  const quotes = useQuotes();

  const sectorRows = (sectors.data ?? [])
    .slice()
    .sort((a, b) => b.changePercent - a.changePercent)
    .map((s) => ({ ...s, short: s.sector.length > 14 ? `${s.sector.slice(0, 13)}…` : s.sector }));
  const best = sectorRows[0];
  const worst = sectorRows[sectorRows.length - 1];
  const s = summary.data;

  const turnoverTrend = (history.data ?? []).map((p) => ({
    label: formatShortDate(p.t),
    turnover: p.volume * p.close,
    volume: p.volume,
  }));

  const topTurnover = (quotes.data ?? [])
    .slice()
    .sort((a, b) => b.turnover - a.turnover)
    .slice(0, 10)
    .map((q) => ({ symbol: q.symbol, turnover: q.turnover, changePercent: q.changePercent }));

  return (
    <AppShell
      title="Analytics"
      tag="Trends"
      subtitle="Sector performance, breadth and trading trends · demonstration dataset"
    >
      <StatGrid cols={4}>
        <Stat
          label="Best sector"
          value={best ? best.sector : "—"}
          sub={best ? formatPercent(best.changePercent) : undefined}
          tone="up"
        />
        <Stat
          label="Weakest sector"
          value={worst ? worst.sector : "—"}
          sub={worst ? formatPercent(worst.changePercent) : undefined}
          tone="down"
        />
        <Stat
          label="Advance / decline"
          value={s ? `${s.advancing} / ${s.declining}` : "—"}
          sub={s ? `${s.unchanged} unchanged` : undefined}
        />
        <Stat
          label="Session turnover"
          value={s ? `Rs. ${formatCompactNpr(s.turnover)}` : "—"}
          sub={s ? `${formatCompactNpr(s.tradedShares)} shares` : undefined}
        />
      </StatGrid>

      <Panel>
        <PanelHeader title="Sector performance" meta="Market-cap weighted daily change by sector" />
        {sectors.isPending ? (
          <ChartSkeleton height={320} />
        ) : sectors.isError || sectorRows.length === 0 ? (
          <StateMessage
            tone="error"
            title="Sector data unavailable"
            action={<RetryButton onClick={() => sectors.refetch()} />}
          />
        ) : (
          <div className="h-[340px] w-full p-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorRows} margin={{ top: 8, right: 16, bottom: 40, left: 4 }}>
                <CartesianGrid stroke="var(--line)" vertical={false} />
                <XAxis
                  dataKey="short"
                  tick={{ ...axisTick, textAnchor: "end" }}
                  angle={-35}
                  interval={0}
                  height={60}
                  tickLine={false}
                  axisLine={{ stroke: "var(--line)" }}
                />
                <YAxis
                  tick={axisTick}
                  tickLine={false}
                  axisLine={false}
                  width={52}
                  tickFormatter={(v: number) => `${v.toFixed(1)}%`}
                />
                <Tooltip
                  cursor={{ fill: "var(--elev)" }}
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: "var(--faint)" }}
                  formatter={(v: number) => [formatPercent(v), "Change"]}
                />
                <Bar dataKey="changePercent" isAnimationActive={false} radius={[2, 2, 0, 0]}>
                  {sectorRows.map((r) => (
                    <Cell
                      key={r.sector}
                      fill={r.changePercent >= 0 ? "var(--up)" : "var(--down)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Panel>

      <Panel>
        <PanelHeader
          title="NEPSE historical performance"
          meta="Index level across the selected range"
          actions={<RangeTabs value={range} onChange={setRange} />}
        />
        {history.isPending ? (
          <ChartSkeleton />
        ) : history.isError || !history.data?.length ? (
          <StateMessage
            tone="error"
            title="Index history unavailable"
            action={<RetryButton onClick={() => history.refetch()} />}
          />
        ) : (
          <PriceChart data={history.data} range={range} height={300} />
        )}
      </Panel>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel>
          <PanelHeader title="Turnover & volume trend" meta="Simulated daily activity" />
          {history.isPending ? (
            <ChartSkeleton height={260} />
          ) : turnoverTrend.length === 0 ? (
            <StateMessage title="No activity data for this range" />
          ) : (
            <div className="h-[280px] w-full p-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={turnoverTrend} margin={{ top: 8, right: 16, bottom: 4, left: 4 }}>
                  <CartesianGrid stroke="var(--line)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={axisTick}
                    tickLine={false}
                    minTickGap={30}
                    axisLine={{ stroke: "var(--line)" }}
                  />
                  <YAxis
                    tick={axisTick}
                    tickLine={false}
                    axisLine={false}
                    width={58}
                    tickFormatter={(v: number) => formatCompactNpr(v)}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelStyle={{ color: "var(--faint)" }}
                    formatter={(v: number, name) => [
                      name === "turnover" ? `Rs. ${formatCompactNpr(v)}` : formatCompactNpr(v),
                      name === "turnover" ? "Turnover" : "Volume",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="turnover"
                    stroke="var(--brand)"
                    strokeWidth={1.6}
                    dot={false}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="volume"
                    stroke="var(--flat)"
                    strokeWidth={1.2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Panel>

        <Panel>
          <PanelHeader title="Turnover leaders" meta="Top 10 companies by value traded" />
          {quotes.isPending ? (
            <LoadingBlock rows={6} />
          ) : topTurnover.length === 0 ? (
            <StateMessage title="No trading data available" />
          ) : (
            <div className="h-[280px] w-full p-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topTurnover}
                  layout="vertical"
                  margin={{ top: 8, right: 20, bottom: 4, left: 8 }}
                >
                  <CartesianGrid stroke="var(--line)" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={axisTick}
                    tickLine={false}
                    axisLine={{ stroke: "var(--line)" }}
                    tickFormatter={(v: number) => formatCompactNpr(v)}
                  />
                  <YAxis
                    type="category"
                    dataKey="symbol"
                    tick={axisTick}
                    tickLine={false}
                    axisLine={false}
                    width={72}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--elev)" }}
                    contentStyle={tooltipStyle}
                    labelStyle={{ color: "var(--faint)" }}
                    formatter={(v: number) => [`Rs. ${formatCompactNpr(v)}`, "Turnover"]}
                  />
                  <Bar dataKey="turnover" isAnimationActive={false} radius={[0, 2, 2, 0]}>
                    {topTurnover.map((r) => (
                      <Cell
                        key={r.symbol}
                        fill={r.changePercent >= 0 ? "var(--up)" : "var(--down)"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Panel>
      </div>
    </AppShell>
  );
}
