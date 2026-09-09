import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader } from "@/components/market/Panel";
import { LoadingBlock, RetryButton, StateMessage } from "@/components/market/States";
import { useQuotes } from "@/hooks/useMarketData";
import { SECTORS, type Quote } from "@/services/marketData";
import { formatCompactNpr, formatPercent, formatPrice } from "@/lib/format";

export const Route = createFileRoute("/heatmap")({
  head: () => ({
    meta: [
      { title: "Market Heatmap by Sector — NEPSE | Meridian" },
      {
        name: "description",
        content:
          "Visual NEPSE heatmap grouped by sector where tile size reflects market capitalisation and colour reflects daily performance.",
      },
      { property: "og:title", content: "Market Heatmap by Sector — NEPSE" },
      {
        property: "og:description",
        content: "Sector-grouped NEPSE heatmap sized by market capitalisation.",
      },
    ],
  }),
  component: HeatmapPage,
});

function tileStyle(changePercent: number) {
  const magnitude = Math.min(Math.abs(changePercent) / 5, 1);
  const alpha = 0.12 + magnitude * 0.55;
  if (changePercent > 0)
    return { backgroundColor: `color-mix(in oklab, var(--up) ${alpha * 100}%, var(--surface))` };
  if (changePercent < 0)
    return { backgroundColor: `color-mix(in oklab, var(--down) ${alpha * 100}%, var(--surface))` };
  return { backgroundColor: "var(--elev)" };
}

function SectorBlock({ sector, members }: { sector: string; members: Quote[] }) {
  const maxCap = Math.max(...members.map((m) => m.marketCap));
  const cap = members.reduce((s, m) => s + m.marketCap, 0);
  const weighted = members.reduce((s, m) => s + m.changePercent * m.marketCap, 0) / cap;

  return (
    <Panel>
      <PanelHeader
        title={sector}
        meta={`${members.length} companies · Rs. ${formatCompactNpr(cap)} market cap`}
        actions={
          <span
            className="font-mono text-xs"
            style={{ color: weighted >= 0 ? "var(--up)" : "var(--down)" }}
          >
            {formatPercent(weighted)}
          </span>
        }
      />
      <div className="grid grid-cols-2 gap-px bg-line p-px sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {members
          .slice()
          .sort((a, b) => b.marketCap - a.marketCap)
          .map((m) => {
            const weight = m.marketCap / maxCap;
            return (
              <Link
                key={m.symbol}
                to="/stocks/$symbol"
                params={{ symbol: m.symbol }}
                title={`${m.name} · ${formatPrice(m.price)} · ${formatPercent(m.changePercent)}`}
                className="flex flex-col justify-between p-3 transition-opacity hover:opacity-80"
                style={{ ...tileStyle(m.changePercent), minHeight: 62 + weight * 46 }}
              >
                <div className="font-mono text-[11px] font-semibold text-ink">{m.symbol}</div>
                <div className="font-mono text-[11px] text-ink/85">
                  {formatPercent(m.changePercent)}
                </div>
              </Link>
            );
          })}
      </div>
    </Panel>
  );
}

function HeatmapPage() {
  const { data, isPending, isError, refetch } = useQuotes();

  return (
    <AppShell
      title="Market Heatmap"
      tag="Sectors"
      subtitle="Tile size = market capitalisation · colour = daily change · demonstration dataset"
    >
      {isPending ? (
        <Panel>
          <LoadingBlock rows={8} />
        </Panel>
      ) : isError ? (
        <Panel>
          <StateMessage
            tone="error"
            title="Heatmap data unavailable"
            action={<RetryButton onClick={() => refetch()} />}
          />
        </Panel>
      ) : (
        <div className="space-y-5">
          {SECTORS.map((sector) => {
            const members = (data ?? []).filter((q) => q.sector === sector);
            if (members.length === 0) return null;
            return <SectorBlock key={sector} sector={sector} members={members} />;
          })}
        </div>
      )}
    </AppShell>
  );
}
