import type { Metadata } from "next";
import { Bot, Clock3, Gauge, HelpCircle, Link2, ScanSearch, TriangleAlert } from "lucide-react";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "Methodology",
  description: "How TokenRWA evaluates tokenized assets: scoring, AI usage, sources, limitations and what 'unknown' means.",
};

const ICONS = [ScanSearch, Gauge, Bot, Link2, HelpCircle, TriangleAlert, Clock3];

const SECTIONS = [
  {
    title: "What TokenRWA evaluates",
    body: [
      "Every analysis targets the same structural questions: what asset actually backs the token, who issues it, how yield is generated, whether and how holders can redeem, who holds custody, what the legal wrapper is, where liquidity exists, which networks the token lives on, and what risks and open questions remain.",
      "The output is an RWA Passport — one structured report designed so a careful reader can understand what they would actually be buying before touching the asset.",
    ],
  },
  {
    title: "How scoring works",
    body: [
      "The RWA Score is deterministic, not model-generated. AI produces structured factor assessments (a 0–100 quality score plus a 0–1 evidence level for each dimension); our scoring engine then applies fixed weights: Transparency 15%, Asset Backing 15%, Liquidity 15%, Redemption 15%, Custody 10%, Contract Risk 10%, Counterparty Risk 10%, Multichain/Infrastructure 10%.",
      "When evidence is thin, the factor's effective score is pulled toward the uncertainty midpoint rather than up. Missing information can only lower confidence — it never inflates a score. Score labels (Exceptional transparency, Strong, Good, Mixed, Elevated uncertainty, High uncertainty) describe research quality and identified risk, not expected financial performance.",
    ],
  },
  {
    title: "How AI is used",
    body: [
      "AI structures and interprets gathered information into the Passport format. It operates under strict rules: distinguish verified information from inference, return null rather than guess, never invent AUM, yields, audits, custodians or legal structures, and never claim regulatory approval without evidence.",
      "Every important field internally carries a value, a confidence level and a source reference. All model output is validated against a strict schema before anything is shown to you.",
    ],
  },
  {
    title: "What sources are used",
    body: [
      "Sources you supply (a project website is fetched server-side and its readable content extracted), freely accessible public market endpoints such as DexScreener, and the model's general knowledge of widely known assets — which is always treated as lower-confidence than supplied sources. Reports list their sources, and key fields link to where information came from.",
    ],
  },
  {
    title: "What “unknown” means",
    body: [
      "Unknown is a legitimate research result, not a gap to be papered over. When information cannot be verified from available sources, fields display “Not verified”, risks can be rated UNKNOWN, and the missing information itself often appears under red flags or questions to ask. A product that discloses little should look like a product that discloses little.",
    ],
  },
  {
    title: "Limitations",
    body: [
      "TokenRWA reads publicly available information. It cannot audit custodians, verify offchain reserves, inspect private legal agreements or predict market behavior. Analyses reflect the moment they were generated and can lag issuer changes. AI can misread ambiguous sources; treat the Passport as a structured starting point for your own diligence, not a substitute for it.",
      "TokenRWA is a research tool, not an investment adviser, broker, exchange, issuer, custodian or law firm.",
    ],
  },
  {
    title: "Data freshness",
    body: [
      "Website content and market data are fetched at analysis time. Reports are stored only in your browser and are not silently refreshed — the “Updated” stamp on each Passport tells you when it was generated. Re-run an analysis any time you want current information.",
    ],
  },
];

export default function MethodologyPage() {
  return (
    <div className="bg-white">
      <PageHeader
        eyebrow="Methodology"
        title={
          <>
            How the research
            <br />
            <span className="bg-gradient-to-r from-violet-soft to-blush bg-clip-text text-transparent">
              actually works.
            </span>
          </>
        }
        description="Scoring is deterministic, AI is constrained, sources are shown, and unknown is a first-class answer."
      />
      <div className="mx-auto max-w-3xl px-5 pb-28 pt-16 sm:px-8">
        <div className="space-y-14">
          {SECTIONS.map((s, i) => (
            <section key={s.title}>
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = ICONS[i] ?? ScanSearch;
                  return (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet/10 text-violet">
                      <Icon className="h-5 w-5" />
                    </span>
                  );
                })()}
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-sm font-bold text-violet">{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-ink">{s.title}</h2>
                </div>
              </div>
              <div className="mt-4 space-y-4">
                {s.body.map((p, j) => (
                  <p key={j} className="text-[15px] leading-relaxed text-ink/80">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
