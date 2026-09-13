import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { BarChart3, ChartCandlestick, Grid2X2, Home, Search, Star } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useQuotes } from "@/hooks/useMarketData";
import { formatPercent, formatPrice, toneTextClass, toneOf } from "@/lib/format";

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
  const [open, setOpen] = useState(false);
  const [shortcut, setShortcut] = useState("Ctrl K");
  const { data: quotes } = useQuotes();
  const navigate = useNavigate();

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
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search ticker"
        aria-keyshortcuts={shortcut === "⌘K" ? "Meta+K" : "Control+K"}
        className="flex h-9 w-9 items-center justify-center gap-2 rounded-[3px] border border-line bg-surface text-left text-sm text-faint transition-colors hover:border-brand/50 hover:text-muted sm:w-56 sm:justify-start sm:px-3"
      >
        <Search aria-hidden="true" className="size-4 shrink-0 sm:hidden" />
        <span className="hidden font-mono text-xs sm:inline">{shortcut}</span>
        <span className="hidden sm:inline">Search ticker…</span>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput autoFocus placeholder="Search by symbol or company…" />
        <CommandList>
          <CommandEmpty>No matching company in the demo dataset.</CommandEmpty>
          <CommandGroup heading="Listed companies">
            {(quotes ?? []).map((q) => (
              <CommandItem
                key={q.symbol}
                value={`${q.symbol} ${q.name}`}
                onSelect={() => {
                  setOpen(false);
                  navigate({ to: "/stocks/$symbol", params: { symbol: q.symbol } });
                }}
              >
                <span className="font-mono text-xs font-medium">{q.symbol}</span>
                <span className="truncate text-muted">{q.name}</span>
                <span className="ml-auto flex items-center gap-3 font-mono text-xs">
                  <span>{formatPrice(q.price)}</span>
                  <span className={toneTextClass[toneOf(q.changePercent)]}>
                    {formatPercent(q.changePercent)}
                  </span>
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
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
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-line bg-canvas/95 px-5 backdrop-blur lg:px-8">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-base font-semibold tracking-tight">{title}</h1>
              {tag ? (
                <span className="hidden rounded-[3px] border border-line px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-faint sm:inline">
                  {tag}
                </span>
              ) : null}
            </div>
            <p className="mt-0.5 truncate font-mono text-[11px] text-faint">{subtitle}</p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {actions}
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
