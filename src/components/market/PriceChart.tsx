import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PricePoint, Range } from "@/services/marketData";
import { formatPrice, formatShortDate } from "@/lib/format";

function labelFor(iso: string, range: Range) {
  if (range === "1D") {
    return new Date(iso).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
  }
  return formatShortDate(iso);
}

export function PriceChart({
  data,
  range,
  height = 300,
  positive = true,
}: {
  data: PricePoint[];
  range: Range;
  height?: number;
  positive?: boolean;
}) {
  const stroke = positive ? "var(--up)" : "var(--down)";
  const rows = data.map((p) => ({ ...p, label: labelFor(p.t, range) }));

  return (
    <div style={{ height }} className="w-full px-1 pb-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={rows} margin={{ top: 12, right: 16, bottom: 4, left: 4 }}>
          <defs>
            <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.22} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--line)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "var(--faint)", fontSize: 11, fontFamily: "var(--font-mono)" }}
            tickLine={false}
            axisLine={{ stroke: "var(--line)" }}
            minTickGap={20}
            interval={0}
          />
          <YAxis
            domain={["auto", "auto"]}
            width={62}
            tick={{ fill: "var(--faint)", fontSize: 11, fontFamily: "var(--font-mono)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => formatPrice(v)}
          />
          <Tooltip
            cursor={{ stroke: "var(--brand)", strokeWidth: 1 }}
            contentStyle={{
              background: "var(--elev)",
              border: "1px solid var(--line)",
              borderRadius: 3,
              fontSize: 12,
            }}
            labelStyle={{ color: "var(--faint)", fontSize: 11 }}
            itemStyle={{ color: "var(--ink)" }}
            formatter={(v: number) => [formatPrice(v), "Close"]}
          />
          <Area
            type="monotone"
            dataKey="close"
            stroke={stroke}
            strokeWidth={1.6}
            fill="url(#priceFill)"
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
