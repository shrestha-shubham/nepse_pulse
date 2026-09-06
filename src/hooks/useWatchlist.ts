import { useCallback, useEffect, useState } from "react";

const KEY = "nepse-watchlist";
const EVENT = "nepse-watchlist-change";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string") : [];
  } catch {
    return [];
  }
}

function write(symbols: string[]) {
  window.localStorage.setItem(KEY, JSON.stringify(symbols));
  window.dispatchEvent(new CustomEvent(EVENT));
}

/**
 * Watchlist persistence for the MVP: browser localStorage, no account needed.
 * Reads happen after hydration so server and client markup stay identical.
 */
export function useWatchlist() {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setSymbols(read());
    sync();
    setReady(true);
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const add = useCallback((symbol: string) => {
    const next = Array.from(new Set([...read(), symbol.toUpperCase()]));
    write(next);
  }, []);

  const remove = useCallback((symbol: string) => {
    write(read().filter((s) => s !== symbol.toUpperCase()));
  }, []);

  const toggle = useCallback((symbol: string) => {
    const s = symbol.toUpperCase();
    const current = read();
    write(current.includes(s) ? current.filter((x) => x !== s) : [...current, s]);
  }, []);

  const has = useCallback((symbol: string) => symbols.includes(symbol.toUpperCase()), [symbols]);

  return { symbols, ready, add, remove, toggle, has };
}
