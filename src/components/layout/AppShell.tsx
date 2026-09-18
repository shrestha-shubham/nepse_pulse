import { Link, useNavigate } from "@tanstack/react-router";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { BarChart3, ChartCandlestick, Grid2X2, Home, RefreshCw, Search, Star } from "lucide-react";
import { useQuotes } from "@/hooks/useMarketData";
import { formatPercent, formatPrice, toneTextClass, toneOf } from "@/lib/format";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", num: "01", label: "Market Overview", icon: Home },
  { to: "/stocks", num: "02", label: "Stocks", icon: ChartCandlestick },
  { to: "/watchlist", num: "03", label: "Watchlist", icon: Star },
  { to: "/heatmap", num: "04", label: "Heatmap", icon: Grid2X2 },
  { to: "/analytics", num: "05", label: "Analytics", icon: BarChart3 },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex-1 space-y-0.5 px-3 py-4 text-sm">
      {NAV.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          activeOptions={{ exact: item.to === "/" }}
          className="flex items-center gap-3 rounded-[3px] border-l-2 border-transparent px-3 py-2 text-muted transition-colors hover:bg-elev/60 hover:text-ink"
          activeProps={{ className: "border-l-2 border-brand bg-elev text-ink font-medium" }}
        >
          <span className="font-mono text-[11px] text-faint">{item.num}</span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function DemoNotice() {
  return (
    <div className="rounded-[3px] border border-line bg-elev p-3">
      <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-flat">
        <span className="size-1.5 rounded-full bg-flat" /> Demo dataset
      </div>
      <p className="mt-1.5 text-[11px] leading-relaxed text-faint">
        Simulated figures for demonstration. Not live exchange data.
      </p>
    </div>
  );
}

function SymbolSearch() {
  const [shortcut, setShortcut] = useState("Ctrl K");
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: quotes } = useQuotes();
  const navigate = useNavigate();
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return (quotes ?? [])
      .filter(
        (quote) =>
          quote.symbol.toLowerCase().includes(normalized) ||
          quote.name.toLowerCase().includes(normalized),
      )
      .slice(0, 6);
  }, [quotes, query]);

  useEffect(() => {
    setShortcut(/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘K" : "Ctrl K");
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTypingTarget =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;
      const openShortcut =
        (e.key === "/" && !isTypingTarget) ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k");

      if (openShortcut) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative">
      <div className="flex h-9 w-full max-w-[10rem] items-center gap-2 rounded-[3px] border border-line bg-surface px-2.5 text-sm text-faint transition-colors focus-within:border-brand/60 sm:max-w-[14rem] sm:px-3">
        <Search aria-hidden="true" className="size-4 shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => window.setTimeout(() => setFocused(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setQuery("");
              setFocused(false);
              inputRef.current?.blur();
            }
            if (e.key === "Enter" && results[0]) {
              setQuery("");
              setFocused(false);
              navigate({ to: "/stocks/$symbol", params: { symbol: results[0].symbol } });
            }
          }}
          id="global-stock-search"
          aria-label="Search stocks by symbol or company"
          aria-keyshortcuts={shortcut === "⌘K" ? "Meta+K" : "Control+K"}
          aria-controls="global-stock-search-results"
          aria-expanded={focused && query.trim().length > 0}
          placeholder="Search stocks…"
          className="min-w-0 flex-1 bg-transparent font-mono text-xs text-ink outline-none placeholder:text-faint"
        />
        {query.trim() ? (
          <button
            type="button"
            aria-label="Clear stock search"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="rounded-[3px] border border-line bg-canvas px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-faint transition-colors hover:border-brand/60 hover:text-ink"
          >
            Clear
          </button>
        ) : null}
        <kbd className="hidden shrink-0 font-mono text-[10px] text-faint lg:inline">{shortcut}</kbd>
      </div>
      {focused && query.trim() ? (
        <div
          id="global-stock-search-results"
          role="listbox"
          aria-label="Matching stocks"
          className="absolute right-0 top-full z-30 mt-2 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-[3px] border border-line bg-surface shadow-lg"
        >
          {results.length > 0 ? (
            <div className="divide-y divide-line">
              {results.map((quote) => (
                <button
                  key={quote.symbol}
                  type="button"
                  role="option"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setQuery("");
                    setFocused(false);
                    navigate({ to: "/stocks/$symbol", params: { symbol: quote.symbol } });
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-elev focus:bg-elev focus:outline-none"
                >
                  <span className="font-mono text-xs font-medium text-ink">{quote.symbol}</span>
                  <span className="min-w-0 flex-1 truncate text-xs text-muted">{quote.name}</span>
                  <span className="font-mono text-[11px] text-muted">
                    {formatPrice(quote.price)}
                  </span>
                  <span className={toneTextClass[toneOf(quote.changePercent)]}>
                    {formatPercent(quote.changePercent)}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-3 py-4 text-center">
              <p className="text-sm text-ink">No stocks found</p>
              <p className="mt-1 text-xs text-faint">Try a different symbol or company name.</p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

interface AppShellProps {
  title: string;
  tag?: string;
  subtitle: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function AppShell({ title, tag, subtitle, children, actions }: AppShellProps) {
  const queryClient = useQueryClient();
  const marketFetches = useIsFetching({ queryKey: ["market"] });

  const refreshMarket = () => {
    void queryClient.invalidateQueries({ queryKey: ["market"] });
  };

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-line bg-surface md:flex">
        <Link to="/" className="flex h-16 items-center gap-2.5 border-b border-line px-5">
          <div className="grid size-8 place-items-center rounded-[3px] bg-brand font-mono text-sm font-semibold text-canvas">
            N
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">Meridian</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
              NEPSE Desk
            </div>
          </div>
        </Link>
        <NavList />
        <div className="border-t border-line p-3">
          <DemoNotice />
        </div>
      </aside>

      <main className="pb-16 md:pb-0 md:pl-60">
        <header className="sticky top-0 z-10 flex h-auto flex-col items-stretch gap-3 border-b border-line bg-canvas/95 px-4 py-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5 lg:px-8">
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <h1 className="truncate text-base font-semibold tracking-tight">{title}</h1>
              {tag ? (
                <span className="hidden rounded-[3px] border border-line px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-faint sm:inline">
                  {tag}
                </span>
              ) : null}
            </div>
            <p className="mt-0.5 truncate font-mono text-[11px] text-faint">{subtitle}</p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
            {actions}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Refresh market data"
              title="Refresh market data"
              onClick={refreshMarket}
              disabled={marketFetches > 0}
            >
              <RefreshCw aria-hidden="true" className={marketFetches > 0 ? "animate-spin" : ""} />
            </Button>
            <SymbolSearch />
            <div className="hidden items-center gap-1.5 font-mono text-[11px] text-muted lg:flex">
              <span className="size-1.5 rounded-full bg-flat" /> Demo
            </div>
          </div>
        </header>

        <div className="space-y-5 px-4 py-6 sm:px-5 lg:px-8">{children}</div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-line bg-surface md:hidden">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/" }}
            className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] text-faint"
            activeProps={{ className: "text-brand" }}
          >
            <item.icon aria-hidden="true" className="size-4" />
            <span className="font-mono text-[11px]">{item.num}</span>
            <span className="max-w-[64px] truncate">{item.label.split(" ")[0]}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
