import { useCallback, useEffect, useState } from "react";

const KEY = "nepse-watchlist";
const EVENT = "nepse-watchlist-change";

function normalize(symbol: string) {
  return symbol
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9.-]/g, "");
}

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return Array.from(new Set(parsed.map((s) => normalize(String(s))).filter(Boolean)));
  } catch {
    return [];
  }
}

function persist(symbols: string[]) {
  if (typeof window === "undefined") return;
  try {
    const next = Array.from(new Set(symbols.map(normalize).filter(Boolean)));
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    // Ignore storage errors so the UI remains usable in privacy-restricted or full-browser modes.
  }
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
    const next = Array.from(new Set([...read(), normalize(symbol)]));
    const cleaned = next.filter(Boolean);
    persist(cleaned);
    setSymbols(cleaned);
  }, []);

  const remove = useCallback((symbol: string) => {
    const next = read().filter((s) => s !== normalize(symbol));
    persist(next);
    setSymbols(next);
  }, []);

  const clear = useCallback(() => {
    persist([]);
    setSymbols([]);
  }, []);

  const toggle = useCallback((symbol: string) => {
    const s = normalize(symbol);
    if (!s) return;
    const current = read();
    const next = current.includes(s) ? current.filter((x) => x !== s) : [...current, s];
    persist(next);
    setSymbols(next);
  }, []);

  const has = useCallback((symbol: string) => symbols.includes(normalize(symbol)), [symbols]);

  return { symbols, ready, add, remove, clear, toggle, has };
}
