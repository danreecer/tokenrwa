import { NextResponse } from "next/server";
import { z } from "zod";
import { aiConfigured, generateText } from "@/lib/ai/provider";
import { getDemoReport } from "@/lib/demo/assets";
import { runAnalysis } from "@/lib/research/analyze";
import type { TReport } from "@/lib/schemas/passport";
import { clientKey, rateLimit } from "@/lib/utils/ratelimit";

export const maxDuration = 180;

const Body = z.object({ queries: z.array(z.string().min(1).max(300)).min(2).max(3) });

const COMPARE_SYSTEM = `You are TokenRWA's research assistant writing a neutral comparison of tokenized real-world assets.

Rules:
- Never tell the user what they should buy. Use framing like "better suited for users prioritizing…" and factual contrasts.
- Ground everything in the supplied research summaries. Do not invent facts.
- 2-3 short paragraphs. Plain English. No hype, no bullet spam.
- Note meaningful differences in access/eligibility, liquidity paths, redemption, custody and structure.`;

function deterministicComparison(reports: TReport[]): string {
  const lines = reports.map((r) => {
    const p = r.passport;
    const strongest = [...r.scores.categories].sort((a, b) => b.score - a.score)[0];
    const weakest = [...r.scores.categories].sort((a, b) => a.score - b.score)[0];
    return `${p.identity.ticker ?? p.identity.name} scores ${r.scores.overall}/100 (${r.scores.label.toLowerCase()}), strongest on ${strongest.label.toLowerCase()} and most limited on ${weakest.label.toLowerCase()}. ${p.identity.oneLiner}.`;
  });
  return (
    lines.join(" ") +
    " These profiles differ mainly in access requirements, liquidity paths and structure — each may be better suited for users prioritizing different things. This comparison is research, not investment advice."
  );
}

export async function POST(req: Request) {
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "bad_request", message: "Enter at least two assets to compare." }, { status: 400 });
  }
  if (!rateLimit(`compare:${clientKey(req)}`, 4, 60_000)) {
    return NextResponse.json(
      { error: "rate_limited", message: "Too many comparisons right now. Please wait a minute." },
      { status: 429 }
    );
  }

  const live = aiConfigured();
  const reports: TReport[] = [];
  const failures: string[] = [];

  for (const q of body.queries) {
    const demo = getDemoReport(q);
    if (!live) {
      if (demo) reports.push(demo);
      else failures.push(q);
      continue;
    }
    try {
      reports.push(await runAnalysis({ query: q }));
    } catch {
      if (demo) reports.push(demo);
      else failures.push(q);
    }
  }

  if (reports.length < 2) {
    return NextResponse.json(
      {
        error: live ? "analysis_failed" : "ai_not_configured",
        message: live
          ? `We couldn't build enough research to compare (${failures.join(", ")} failed). Try adding official websites.`
          : "Live comparison needs server configuration (GEMINI_API_KEY). Demo comparison works for OUSG, BUIDL and USDY.",
      },
      { status: live ? 502 : 503 }
    );
  }

  let commentary: string;
  let commentaryDemo = !live;
  if (live) {
    try {
      const context = reports
        .map((r) => {
          const p = r.passport;
          return `ASSET: ${p.identity.name} (${p.identity.ticker ?? "-"})\nScore: ${r.scores.overall}/100 (${r.scores.label})\nSummary: ${p.summary}\nExposure: ${p.asset.underlyingAsset.value ?? "unknown"}\nEligibility: ${p.legal.eligibility.value ?? "unknown"}\nLiquidity: ${p.liquidity.markets.value ?? "unknown"}\nRedemption: ${p.redemption.available.value ?? "unknown"}\nCustody: ${p.custody.assetCustodian.value ?? "unknown"}\nTop risks: ${p.risks.slice(0, 4).map((x) => `${x.category} (${x.level})`).join(", ")}`;
        })
        .join("\n\n");
      commentary = (await generateText(COMPARE_SYSTEM, `Compare these tokenized assets:\n\n${context}`)).trim();
    } catch {
      commentary = deterministicComparison(reports);
      commentaryDemo = true;
    }
  } else {
    commentary = deterministicComparison(reports);
  }

  return NextResponse.json({ reports, commentary, commentaryDemo, failures });
}
