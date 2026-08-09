import type { TMarketData } from "@/lib/schemas/passport";

type DexPair = {
  chainId: string;
  dexId: string;
  url: string;
  priceUsd?: string;
  liquidity?: { usd?: number };
  volume?: { h24?: number };
  fdv?: number;
  baseToken?: { symbol?: string; name?: string; address?: string };
};

/**
 * Enrich a query (contract address or ticker) with freely accessible
 * public market data from DexScreener. Returns null when nothing is found —
 * the UI then shows "Market data unavailable"; nothing is ever invented.
 */
export async function fetchTokenMarketData(query: string): Promise<TMarketData | null> {
  const q = query.trim();
  if (!q) return null;
  const endpoint = /^0x[a-fA-F0-9]{40}$/.test(q)
    ? `https://api.dexscreener.com/latest/dex/tokens/${q}`
    : `https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(q)}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8_000);
  try {
    const res = await fetch(endpoint, {
      signal: controller.signal,
      headers: { accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { pairs?: DexPair[] };
    const pairs = (data.pairs ?? []).filter((p) => p.liquidity?.usd != null);
    if (pairs.length === 0) return null;
    pairs.sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0));
    // For ticker searches, keep only pairs whose base token matches the query.
    const matching = /^0x/.test(q)
      ? pairs
      : pairs.filter((p) => p.baseToken?.symbol?.toLowerCase() === q.toLowerCase());
    const use = matching.length > 0 ? matching : null;
    if (!use) return null;
    const top = use[0];
    return {
      priceUsd: top.priceUsd ?? null,
      liquidityUsd: use.reduce((s, p) => s + (p.liquidity?.usd ?? 0), 0),
      volume24hUsd: use.reduce((s, p) => s + (p.volume?.h24 ?? 0), 0),
      fdvUsd: top.fdv ?? null,
      pairCount: use.length,
      topPair: { dex: top.dexId, chain: top.chainId, url: top.url },
      source: "https://dexscreener.com",
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
