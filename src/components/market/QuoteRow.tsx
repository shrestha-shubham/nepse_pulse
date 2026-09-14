import { Link } from "@tanstack/react-router";
import type { Quote } from "@/services/marketData";
import { formatCompactNpr, formatPercent, formatPrice, toneOf, toneTextClass } from "@/lib/format";
import { groupNepali } from "@/lib/format";

export function MoveList({ quotes, empty }: { quotes: Quote[]; empty: string }) {
  if (quotes.length === 0) {
    return <p className="px-4 py-8 text-center text-[13px] text-faint">{empty}</p>;
  }
  return (
    <ul className="divide-y divide-line">
      {quotes.map((q) => (
        <li key={q.symbol}>
          <Link
            to="/stocks/$symbol"
            params={{ symbol: q.symbol }}
            className="flex min-h-[59px] items-center justify-between gap-3 px-4 py-2.5 transition-colors hover:bg-elev sm:px-5"
          >
            <div className="min-w-0">
              <div className="font-mono text-xs font-medium text-ink">{q.symbol}</div>
              <div className="truncate text-[11px] text-faint">{q.name}</div>
            </div>
            <div className="text-right font-mono text-xs">
              <div className="text-ink">{formatPrice(q.price)}</div>
              <div className={toneTextClass[toneOf(q.changePercent)]}>
                {formatPercent(q.changePercent)}
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function TurnoverList({ quotes }: { quotes: Quote[] }) {
  return (
    <ul className="divide-y divide-line">
      {quotes.map((q) => (
        <li key={q.symbol}>
          <Link
            to="/stocks/$symbol"
            params={{ symbol: q.symbol }}
            className="flex min-h-[59px] items-center justify-between gap-3 px-4 py-2.5 transition-colors hover:bg-elev sm:px-5"
          >
            <div className="min-w-0">
              <div className="font-mono text-xs font-medium text-ink">{q.symbol}</div>
              <div className="truncate text-[11px] text-faint">{groupNepali(q.volume)} shares</div>
            </div>
            <div className="text-right font-mono text-xs">
              <div className="text-ink">Rs. {formatCompactNpr(q.turnover)}</div>
              <div className={toneTextClass[toneOf(q.changePercent)]}>
                {formatPercent(q.changePercent)}
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
