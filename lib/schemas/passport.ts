import { z } from "zod";

/** A field with provenance: value, confidence, optional source URL. */
export const SourcedString = z.object({
  value: z.string().nullable(),
  confidence: z.number().min(0).max(1).nullable().optional(),
  source: z.string().nullable().optional(),
});
export type TSourcedString = z.infer<typeof SourcedString>;

export const RiskLevel = z.enum(["LOW", "MODERATE", "ELEVATED", "UNKNOWN"]);
export type TRiskLevel = z.infer<typeof RiskLevel>;

export const RiskItem = z.object({
  category: z.string(),
  level: RiskLevel,
  explanation: z.string(),
});

export const ChainInfo = z.object({
  chain: z.string(),
  interoperability: z.enum(["Native", "Bridged", "Unknown"]).default("Unknown"),
});

export const FactorAssessment = z.object({
  /** 0–100 factor quality assessment produced by the AI from evidence. */
  score: z.number().min(0).max(100),
  /** How much verified evidence backs this factor, 0–1. */
  evidence: z.number().min(0).max(1),
  note: z.string().nullable().optional(),
});
export type TFactorAssessment = z.infer<typeof FactorAssessment>;

export const PassportFactors = z.object({
  transparency: FactorAssessment,
  assetBacking: FactorAssessment,
  liquidity: FactorAssessment,
  redemption: FactorAssessment,
  custody: FactorAssessment,
  contractRisk: FactorAssessment,
  counterpartyRisk: FactorAssessment,
  multichain: FactorAssessment,
});
export type TPassportFactors = z.infer<typeof PassportFactors>;

export const PassportSchema = z.object({
  identity: z.object({
    name: z.string(),
    ticker: z.string().nullable(),
    oneLiner: z.string(),
    category: z.string().nullable(),
    primaryChain: z.string().nullable(),
    website: z.string().nullable(),
  }),
  summary: z.string(),
  whatYouAreBuying: z.string(),
  asset: z.object({
    underlyingAsset: SourcedString,
    assetClass: SourcedString,
    issuer: SourcedString,
    productStructure: SourcedString,
    currency: SourcedString,
    reportedAum: SourcedString,
    yieldMechanism: SourcedString,
  }),
  token: z.object({
    symbol: SourcedString,
    blockchain: SourcedString,
    contract: SourcedString,
    standard: SourcedString,
    transferability: SourcedString,
    mintBurn: SourcedString,
    supply: SourcedString,
  }),
  yield: z.object({
    source: SourcedString,
    reportedApy: SourcedString,
    distribution: SourcedString,
    sustainability: z.string().nullable(),
  }),
  redemption: z.object({
    available: SourcedString,
    minimum: SourcedString,
    settlementTime: SourcedString,
    currency: SourcedString,
    restrictions: SourcedString,
    primaryVsSecondary: z.string().nullable(),
  }),
  custody: z.object({
    assetCustodian: SourcedString,
    tokenCustodyDependencies: SourcedString,
    serviceProviders: SourcedString,
    offchainDependencies: SourcedString,
  }),
  legal: z.object({
    jurisdiction: SourcedString,
    structure: SourcedString,
    eligibility: SourcedString,
    kyc: SourcedString,
    transferRestrictions: SourcedString,
    regulatoryNotes: SourcedString,
  }),
  liquidity: z.object({
    markets: SourcedString,
    dexCexAvailability: SourcedString,
    reportedLiquidity: SourcedString,
    primaryRedemption: SourcedString,
    concentration: SourcedString,
    limitations: z.string().nullable(),
  }),
  multichain: z.object({
    chains: z.array(ChainInfo),
    notes: z.string().nullable(),
  }),
  risks: z.array(RiskItem),
  redFlags: z.array(z.string()),
  questionsToAsk: z.array(z.string()).min(3).max(7),
  factors: PassportFactors,
  sources: z.array(
    z.object({
      url: z.string(),
      title: z.string().nullable().optional(),
      kind: z.enum(["website", "market", "explorer", "doc", "other"]).default("other"),
    })
  ),
});
export type TPassport = z.infer<typeof PassportSchema>;

/** Deterministic scores derived from factors — computed server-side, never by the model. */
export type TScores = {
  overall: number;
  label: string;
  categories: { key: keyof TPassportFactors; label: string; score: number; evidence: number; note: string | null }[];
  confidence: number;
};

export type TReport = {
  id: string;
  createdAt: number;
  demo: boolean;
  query: string;
  passport: TPassport;
  scores: TScores;
  market: TMarketData | null;
};

export type TMarketData = {
  priceUsd: string | null;
  liquidityUsd: number | null;
  volume24hUsd: number | null;
  fdvUsd: number | null;
  pairCount: number;
  topPair: { dex: string; chain: string; url: string } | null;
  source: string;
};
