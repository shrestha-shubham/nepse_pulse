import { queryOptions, useQuery } from "@tanstack/react-query";
import { marketData, type Range } from "@/services/marketData";

const STALE = 60_000;

export const marketSummaryOptions = queryOptions({
  queryKey: ["market", "summary"],
  queryFn: () => marketData.getMarketSummary(),
  staleTime: STALE,
});

export const indexHistoryOptions = (range: Range) =>
  queryOptions({
    queryKey: ["market", "index-history", range],
    queryFn: () => marketData.getIndexHistory(range),
    staleTime: STALE,
  });

export const quotesOptions = queryOptions({
  queryKey: ["market", "quotes"],
  queryFn: () => marketData.getQuotes(),
  staleTime: STALE,
});

export const quoteOptions = (symbol: string) =>
  queryOptions({
    queryKey: ["market", "quote", symbol.toUpperCase()],
    queryFn: () => marketData.getQuote(symbol),
    staleTime: STALE,
    retry: false,
  });

export const priceHistoryOptions = (symbol: string, range: Range) =>
  queryOptions({
    queryKey: ["market", "price-history", symbol.toUpperCase(), range],
    queryFn: () => marketData.getPriceHistory(symbol, range),
    staleTime: STALE,
    retry: false,
  });

export const companyProfileOptions = (symbol: string) =>
  queryOptions({
    queryKey: ["market", "profile", symbol.toUpperCase()],
    queryFn: () => marketData.getCompanyProfile(symbol),
    staleTime: STALE,
    retry: false,
  });

export const sectorPerformanceOptions = queryOptions({
  queryKey: ["market", "sectors"],
  queryFn: () => marketData.getSectorPerformance(),
  staleTime: STALE,
});

export const recentTradesOptions = queryOptions({
  queryKey: ["market", "recent-trades"],
  queryFn: () => marketData.getRecentTrades(),
  staleTime: STALE,
});

export const useMarketSummary = () => useQuery(marketSummaryOptions);
export const useIndexHistory = (range: Range) => useQuery(indexHistoryOptions(range));
export const useQuotes = () => useQuery(quotesOptions);
export const useQuote = (symbol: string) => useQuery(quoteOptions(symbol));
export const usePriceHistory = (symbol: string, range: Range) =>
  useQuery(priceHistoryOptions(symbol, range));
export const useCompanyProfile = (symbol: string) => useQuery(companyProfileOptions(symbol));
export const useSectorPerformance = () => useQuery(sectorPerformanceOptions);
export const useRecentTrades = () => useQuery(recentTradesOptions);
