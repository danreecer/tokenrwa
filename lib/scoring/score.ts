import type { TPassportFactors, TScores } from "@/lib/schemas/passport";

const WEIGHTS: Record<keyof TPassportFactors, number> = {
  transparency: 0.15,
  assetBacking: 0.15,
  liquidity: 0.15,
  redemption: 0.15,
  custody: 0.1,
  contractRisk: 0.1,
  counterpartyRisk: 0.1,
  multichain: 0.1,
};

export const FACTOR_LABELS: Record<keyof TPassportFactors, string> = {
  transparency: "Transparency",
  assetBacking: "Asset Backing",
  liquidity: "Liquidity",
  redemption: "Redemption",
  custody: "Custody",
  contractRisk: "Contract Risk",
  counterpartyRisk: "Counterparty Risk",
  multichain: "Multichain Access",
};

export function scoreLabel(score: number): string {
  if (score >= 90) return "Exceptional transparency";
  if (score >= 80) return "Strong";
  if (score >= 70) return "Good";
  if (score >= 60) return "Mixed";
  if (score >= 40) return "Elevated uncertainty";
  return "High uncertainty";
}

/**
 * Deterministic weighted scoring. Factor scores come from structured AI
 * assessments, but the overall score, evidence discounting and labels are
 * computed here — the model never emits the final number.
 */
export function computeScores(factors: TPassportFactors): TScores {
  const keys = Object.keys(WEIGHTS) as (keyof TPassportFactors)[];
  let weighted = 0;
  let evidenceSum = 0;

  const categories = keys.map((key) => {
    const f = factors[key];
    // Low evidence pulls the effective score toward the uncertainty midpoint (50):
    // with zero evidence a score moves 60% of the way to 50; full evidence keeps it unchanged.
    const effective = Math.round(f.score + (50 - f.score) * (1 - f.evidence) * 0.6);
    const clamped = Math.max(0, Math.min(100, effective));
    weighted += clamped * WEIGHTS[key];
    evidenceSum += f.evidence;
    return {
      key,
      label: FACTOR_LABELS[key],
      score: clamped,
      evidence: f.evidence,
      note: f.note ?? null,
    };
  });

  const overall = Math.max(0, Math.min(100, Math.round(weighted)));
  return {
    overall,
    label: scoreLabel(overall),
    categories,
    confidence: Math.round((evidenceSum / keys.length) * 100) / 100,
  };
}
