import { generateJson } from "@/lib/ai/provider";
import { fetchTokenMarketData } from "@/lib/research/token";
import { researchWebsite, type WebsiteResearch } from "@/lib/research/website";
import { PassportSchema, type TMarketData, type TPassport, type TReport } from "@/lib/schemas/passport";
import { computeScores } from "@/lib/scoring/score";

export type AnalyzeInput = {
  query?: string;
  name?: string;
  website?: string;
  contract?: string;
  network?: string;
};

export type NormalizedInput = {
  label: string;
  name: string | null;
  website: string | null;
  contract: string | null;
  network: string | null;
};

const URL_RE = /^(https?:\/\/)?[a-z0-9-]+(\.[a-z0-9-]+)+(\/[^\s]*)?$/i;
const EVM_RE = /^0x[a-fA-F0-9]{40}$/;
const SOL_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export function normalizeInput(input: AnalyzeInput): NormalizedInput {
  const q = (input.query ?? "").trim();
  let name = input.name?.trim() || null;
  let website = input.website?.trim() || null;
  let contract = input.contract?.trim() || null;
  const network = input.network?.trim() || null;

  if (q) {
    if (EVM_RE.test(q) || SOL_RE.test(q)) contract = contract ?? q;
    else if (URL_RE.test(q) && q.includes(".")) website = website ?? q;
    else name = name ?? q;
  }
  const label = name ?? website ?? contract ?? q;
  return { label, name, website, contract, network };
}

const SYSTEM_PROMPT = `You are the research engine of TokenRWA, an AI research tool for tokenized real-world assets (RWAs).

Non-negotiable rules:
- Do not fabricate facts. Distinguish verified information (present in the supplied sources) from inference based on general knowledge.
- When a value is unknown or unverified, return null for "value" — never guess. "Unknown" is a legitimate, expected result.
- Never invent AUM figures, yields, audits, custody providers, legal structures, or regulatory approvals.
- Never claim regulatory approval without evidence.
- Never provide personalized investment advice or recommendations to buy/sell.
- For every sourced field, include a "source" URL only when the fact actually comes from a supplied source; use null otherwise. Include "confidence" between 0 and 1.
- Factor "score" values (0-100) assess research quality and identified risk for that dimension; "evidence" (0-1) reflects how much verified information supports the assessment. Low information means low evidence, not a high score.
- Write in plain, precise English a non-expert can follow. No hype.

Return ONLY a JSON object with exactly this shape (no markdown):
{
  "identity": {"name": str, "ticker": str|null, "oneLiner": str, "category": str|null, "primaryChain": str|null, "website": str|null},
  "summary": str (3-5 sentence executive summary),
  "whatYouAreBuying": str (plain-English explanation of the underlying economic exposure),
  "asset": {"underlyingAsset": F, "assetClass": F, "issuer": F, "productStructure": F, "currency": F, "reportedAum": F, "yieldMechanism": F},
  "token": {"symbol": F, "blockchain": F, "contract": F, "standard": F, "transferability": F, "mintBurn": F, "supply": F},
  "yield": {"source": F, "reportedApy": F, "distribution": F, "sustainability": str|null},
  "redemption": {"available": F, "minimum": F, "settlementTime": F, "currency": F, "restrictions": F, "primaryVsSecondary": str|null},
  "custody": {"assetCustodian": F, "tokenCustodyDependencies": F, "serviceProviders": F, "offchainDependencies": F},
  "legal": {"jurisdiction": F, "structure": F, "eligibility": F, "kyc": F, "transferRestrictions": F, "regulatoryNotes": F},
  "liquidity": {"markets": F, "dexCexAvailability": F, "reportedLiquidity": F, "primaryRedemption": F, "concentration": F, "limitations": str|null},
  "multichain": {"chains": [{"chain": str, "interoperability": "Native"|"Bridged"|"Unknown"}], "notes": str|null},
  "risks": [{"category": str, "level": "LOW"|"MODERATE"|"ELEVATED"|"UNKNOWN", "explanation": str}] (cover: Asset Risk, Liquidity Risk, Issuer Risk, Custody Risk, Smart Contract Risk, Oracle Risk, Redemption Risk, Regulatory Risk, Bridge Risk — omit categories that are truly not applicable),
  "redFlags": [str] (only signals justified by available information; empty array is fine),
  "questionsToAsk": [str] (3-7 intelligent due-diligence questions specific to this asset),
  "factors": {"transparency": G, "assetBacking": G, "liquidity": G, "redemption": G, "custody": G, "contractRisk": G, "counterpartyRisk": G, "multichain": G},
  "sources": [{"url": str, "title": str|null, "kind": "website"|"market"|"explorer"|"doc"|"other"}]
}
where F = {"value": str|null, "confidence": number|null, "source": str|null} and G = {"score": 0-100, "evidence": 0-1, "note": str|null}.`;

export class AnalyzeError extends Error {
  constructor(public code: string) {
    super(code);
  }
}

export async function runAnalysis(input: AnalyzeInput): Promise<TReport> {
  const norm = normalizeInput(input);
  if (!norm.label) throw new AnalyzeError("empty_input");

  let site: WebsiteResearch | null = null;
  let siteError: string | null = null;
  if (norm.website) {
    try {
      site = await researchWebsite(norm.website);
    } catch (e) {
      siteError = e instanceof Error ? e.message : "fetch_failed";
      if (siteError === "invalid_url" || siteError === "blocked_url") throw new AnalyzeError(siteError);
    }
  }

  let market: TMarketData | null = null;
  const marketQuery = norm.contract ?? norm.name ?? "";
  if (marketQuery) market = await fetchTokenMarketData(marketQuery);

  const context: string[] = [];
  context.push(`USER QUERY: ${norm.label}`);
  if (norm.name) context.push(`ASSET/PROJECT NAME: ${norm.name}`);
  if (norm.contract) context.push(`CONTRACT ADDRESS: ${norm.contract}`);
  if (norm.network) context.push(`NETWORK (user-specified): ${norm.network}`);
  if (site) {
    context.push(
      `WEBSITE SOURCE (${site.url}):\nTitle: ${site.title ?? "n/a"}\nDescription: ${site.description ?? "n/a"}\nHeadings: ${site.headings.join(" | ")}\nPage text (truncated): ${site.text}\nOutbound links: ${site.links.slice(0, 15).join(", ")}`
    );
  } else if (norm.website) {
    context.push(`WEBSITE ${norm.website} could not be fetched (${siteError}). Do not invent website content.`);
  }
  if (market) {
    context.push(
      `PUBLIC MARKET DATA (source: ${market.source}, via DexScreener):\nPrice USD: ${market.priceUsd ?? "n/a"}\nDEX liquidity USD (sum across pairs): ${market.liquidityUsd?.toFixed(0) ?? "n/a"}\n24h volume USD: ${market.volume24hUsd?.toFixed(0) ?? "n/a"}\nFDV USD: ${market.fdvUsd ?? "n/a"}\nPair count: ${market.pairCount}\nTop pair: ${market.topPair ? `${market.topPair.dex} on ${market.topPair.chain} (${market.topPair.url})` : "n/a"}`
    );
  } else {
    context.push("PUBLIC MARKET DATA: unavailable for this query. Do not invent market metrics.");
  }
  context.push(
    "TASK: Build the complete RWA Passport JSON for this asset. Use supplied sources first; you may add well-established general knowledge about widely known assets, but mark such fields with lower confidence and source: null."
  );

  const raw = await generateJson(SYSTEM_PROMPT, context.join("\n\n"));
  const parsed = PassportSchema.safeParse(raw);
  if (!parsed.success) throw new AnalyzeError("ai_bad_output");
  const passport: TPassport = parsed.data;

  // Ensure supplied sources are represented.
  const urls = new Set(passport.sources.map((s) => s.url));
  if (site && !urls.has(site.url)) passport.sources.unshift({ url: site.url, title: site.title, kind: "website" });
  if (market && !urls.has(market.source)) passport.sources.push({ url: market.source, title: "DexScreener market data", kind: "market" });

  return {
    id: `r_${Math.random().toString(36).slice(2, 10)}`,
    createdAt: Date.now(),
    demo: false,
    query: norm.label,
    passport,
    scores: computeScores(passport.factors),
    market,
  };
}
