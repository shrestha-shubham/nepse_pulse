/**
 * Market data service layer.
 *
 * The rest of the application talks ONLY to this module. Swapping the mock
 * provider for a real NEPSE/broker API means implementing `MarketDataProvider`
 * elsewhere and returning it from `getProvider()` — no UI code has to change.
 */
import { COMPANY_SEEDS, SECTORS, type Sector } from "@/data/mockStocks";

export type { Sector };
export { SECTORS };

export interface Quote {
  symbol: string;
  name: string;
  sector: Sector;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume: number;
  turnover: number;
  marketCap: number;
  high52: number;
  low52: number;
  dayHigh: number;
  dayLow: number;
  listedShares: number;
  updatedAt: string;
}

export interface CompanyProfile {
  symbol: string;
  description: string;
  listedOn: string;
  paidUpCapital: number;
  eps: number;
  peRatio: number;
  bookValue: number;
  dividendYield: number;
}

export interface PricePoint {
  /** ISO date (or ISO datetime for intraday ranges) */
  t: string;
  close: number;
  volume: number;
}

export interface MarketSummary {
  index: number;
  change: number;
  changePercent: number;
  turnover: number;
  tradedShares: number;
  transactions: number;
  advancing: number;
  declining: number;
  unchanged: number;
  asOf: string;
  isLive: false;
}

export interface SectorPerformance {
  sector: Sector;
  changePercent: number;
  turnover: number;
  marketCap: number;
  companies: number;
}

export interface TradeTick {
  time: string;
  symbol: string;
  price: number;
  changePercent: number;
  volume: number;
}

export type Range = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y";

export interface MarketDataProvider {
  readonly sourceLabel: string;
  readonly isLive: boolean;
  getMarketSummary(): Promise<MarketSummary>;
  getIndexHistory(range: Range): Promise<PricePoint[]>;
  getQuotes(): Promise<Quote[]>;
  getQuote(symbol: string): Promise<Quote>;
  getPriceHistory(symbol: string, range: Range): Promise<PricePoint[]>;
  getCompanyProfile(symbol: string): Promise<CompanyProfile>;
  getSectorPerformance(): Promise<SectorPerformance[]>;
  getRecentTrades(): Promise<TradeTick[]>;
}

/* ------------------------------------------------------------------ */
/* Deterministic pseudo-random helpers                                 */
/* ------------------------------------------------------------------ */

/** Fixed session date so server render and client render always agree. */
export const SESSION_DATE = new Date("2025-06-15T15:00:00Z");

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/* ------------------------------------------------------------------ */
/* Mock provider                                                       */
/* ------------------------------------------------------------------ */

const RANGE_CONFIG: Record<Range, { points: number; stepMs: number; intraday: boolean }> = {
  "1D": { points: 26, stepMs: 15 * 60 * 1000, intraday: true },
  "1W": { points: 7, stepMs: 24 * 60 * 60 * 1000, intraday: false },
  "1M": { points: 30, stepMs: 24 * 60 * 60 * 1000, intraday: false },
  "3M": { points: 66, stepMs: 24 * 60 * 60 * 1000, intraday: false },
  "6M": { points: 130, stepMs: 24 * 60 * 60 * 1000, intraday: false },
  "1Y": { points: 250, stepMs: 24 * 60 * 60 * 1000, intraday: false },
};

function buildSeries(seed: string, lastValue: number, range: Range, drift: number): PricePoint[] {
  const { points, stepMs } = RANGE_CONFIG[range];
  const rand = rng(hash(`${seed}:${range}`));
  const vol = range === "1D" ? 0.003 : 0.016;
  const values: number[] = [];
  let v = lastValue;
  for (let i = 0; i < points; i++) {
    values.push(v);
    v = v / (1 + (rand() - 0.5) * vol * 2 + drift / points);
  }
  values.reverse();
  const end = SESSION_DATE.getTime();
  return values.map((close, i) => {
    const t = new Date(end - (points - 1 - i) * stepMs);
    return {
      t: t.toISOString(),
      close: round2(close),
      volume: Math.round(20000 + rand() * 380000),
    };
  });
}

function buildQuote(seedIndex: number): Quote {
  const seed = COMPANY_SEEDS[seedIndex];
  const rand = rng(hash(seed.symbol));
  const drift = (rand() - 0.48) * 0.09; // daily move roughly -4.5% .. +4.5%
  const previousClose = round2(seed.basePrice * (0.94 + rand() * 0.12));
  const price = round2(previousClose * (1 + drift));
  const change = round2(price - previousClose);
  const changePercent = round2((change / previousClose) * 100);
  const volume = Math.round(2000 + rand() * 480000);
  const turnover = Math.round(volume * price);
  const spread = 0.18 + rand() * 0.5;
  return {
    symbol: seed.symbol,
    name: seed.name,
    sector: seed.sector,
    price,
    previousClose,
    change,
    changePercent,
    volume,
    turnover,
    marketCap: Math.round(price * seed.listedShares),
    high52: round2(price * (1 + spread)),
    low52: round2(price * (1 - spread * 0.55)),
    dayHigh: round2(Math.max(price, previousClose) * (1 + rand() * 0.015)),
    dayLow: round2(Math.min(price, previousClose) * (1 - rand() * 0.015)),
    listedShares: seed.listedShares,
    updatedAt: SESSION_DATE.toISOString(),
  };
}

const QUOTES: Quote[] = COMPANY_SEEDS.map((_, i) => buildQuote(i));
const QUOTE_MAP = new Map(QUOTES.map((q) => [q.symbol, q]));

const delay = <T,>(value: T, ms = 220) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));

export class SymbolNotFoundError extends Error {
  constructor(symbol: string) {
    super(`No listed company found for symbol "${symbol}".`);
    this.name = "SymbolNotFoundError";
  }
}

const mockProvider: MarketDataProvider = {
  sourceLabel: "Local demo dataset",
  isLive: false,

  async getMarketSummary() {
    const advancing = QUOTES.filter((q) => q.change > 0).length;
    const declining = QUOTES.filter((q) => q.change < 0).length;
    const turnover = QUOTES.reduce((s, q) => s + q.turnover, 0);
    const tradedShares = QUOTES.reduce((s, q) => s + q.volume, 0);
    const weighted =
      QUOTES.reduce((s, q) => s + q.changePercent * q.marketCap, 0) /
      QUOTES.reduce((s, q) => s + q.marketCap, 0);
    const index = 2241.87;
    const changePercent = round2(weighted);
    const change = round2((index * changePercent) / 100);
    return delay<MarketSummary>({
      index,
      change,
      changePercent,
      turnover,
      tradedShares,
      transactions: 62_418,
      advancing,
      declining,
      unchanged: QUOTES.length - advancing - declining,
      asOf: SESSION_DATE.toISOString(),
      isLive: false,
    });
  },

  async getIndexHistory(range) {
    return delay(buildSeries("NEPSE-INDEX", 2241.87, range, 0.11));
  },

  async getQuotes() {
    return delay(QUOTES);
  },

  async getQuote(symbol) {
    const quote = QUOTE_MAP.get(symbol.toUpperCase());
    if (!quote) throw new SymbolNotFoundError(symbol);
    return delay(quote);
  },

  async getPriceHistory(symbol, range) {
    const quote = QUOTE_MAP.get(symbol.toUpperCase());
    if (!quote) throw new SymbolNotFoundError(symbol);
    return delay(buildSeries(quote.symbol, quote.price, range, quote.changePercent / 400));
  },

  async getCompanyProfile(symbol) {
    const quote = QUOTE_MAP.get(symbol.toUpperCase());
    if (!quote) throw new SymbolNotFoundError(symbol);
    const rand = rng(hash(`${quote.symbol}:profile`));
    const eps = round2(quote.price / (12 + rand() * 30));
    return delay<CompanyProfile>({
      symbol: quote.symbol,
      description: `${quote.name} is a NEPSE-listed company operating in the ${quote.sector} sector. This profile text is placeholder content included with the demonstration dataset.`,
      listedOn: `20${(60 + Math.floor(rand() * 15)).toString()} B.S.`,
      paidUpCapital: Math.round(quote.listedShares * 100),
      eps,
      peRatio: round2(quote.price / eps),
      bookValue: round2(quote.price / (1.2 + rand() * 2.2)),
      dividendYield: round2(1 + rand() * 8),
    });
  },

  async getSectorPerformance() {
    const rows: SectorPerformance[] = SECTORS.map((sector) => {
      const members = QUOTES.filter((q) => q.sector === sector);
      const cap = members.reduce((s, q) => s + q.marketCap, 0);
      return {
        sector,
        changePercent: cap
          ? round2(members.reduce((s, q) => s + q.changePercent * q.marketCap, 0) / cap)
          : 0,
        turnover: members.reduce((s, q) => s + q.turnover, 0),
        marketCap: cap,
        companies: members.length,
      };
    }).filter((r) => r.companies > 0);
    return delay(rows);
  },

  async getRecentTrades() {
    const rand = rng(hash("recent-trades"));
    const picks = [...QUOTES].sort((a, b) => b.turnover - a.turnover).slice(0, 8);
    const base = SESSION_DATE.getTime();
    return delay(
      picks.map((q, i) => ({
        time: new Date(base - i * (37_000 + Math.floor(rand() * 40_000))).toISOString(),
        symbol: q.symbol,
        price: q.price,
        changePercent: q.changePercent,
        volume: Math.round(q.volume / (3 + i)),
      })),
    );
  },
};

/**
 * Swap this out (behind an env flag such as `import.meta.env.VITE_NEPSE_API_URL`)
 * once a legitimate NEPSE data source is available.
 */
export function getProvider(): MarketDataProvider {
  return mockProvider;
}

export const marketData = getProvider();
