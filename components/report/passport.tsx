"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  Copy,
  Globe,
  Link2,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import type { TReport, TSourcedString } from "@/lib/schemas/passport";
import { formatUsd, monogram, timeAgo } from "@/lib/utils/format";
import ScoreRing from "@/components/report/score-ring";
import { ChainPill, RiskBadge } from "@/components/report/primitives";
import ExportButtons from "@/components/report/export-buttons";
import ReportChat from "@/components/report/chat";

/* ------------------------------------------------------------------ */
/* Navigation model                                                    */
/* ------------------------------------------------------------------ */

const NAV = [
  ["01", "Overview", "summary"],
  ["02", "Asset", "asset"],
  ["03", "Token", "token"],
  ["04", "Yield", "yield"],
  ["05", "Redemption", "redemption"],
  ["06", "Custody", "custody"],
  ["07", "Legal", "legal"],
  ["08", "Liquidity", "liquidity"],
  ["09", "Multichain", "multichain"],
  ["10", "Risks", "risks"],
  ["11", "Diligence", "diligence"],
  ["12", "Sources", "sources"],
] as const;

function useActiveSection(): string {
  const [active, setActive] = useState("summary");
  useEffect(() => {
    const ids = NAV.map(([, , id]) => id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" }
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);
  return active;
}

function askAI(question: string) {
  window.dispatchEvent(new CustomEvent("tokenrwa-ask", { detail: question }));
}

/* ------------------------------------------------------------------ */
/* Document primitives (typography-first, not cards)                   */
/* ------------------------------------------------------------------ */

function DocSection({
  number,
  title,
  id,
  children,
  aside,
}: {
  number: string;
  title: string;
  id: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <section id={id} className="print-block scroll-mt-32 border-t border-edge py-12 first:border-t-0 sm:py-14">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h2 className="flex items-baseline gap-4 font-display text-[26px] font-bold tracking-tight text-ink sm:text-[30px]">
          <span className="text-base font-bold text-violet">{number}</span>
          {title}
        </h2>
        {aside}
      </div>
      <div className="mt-7">{children}</div>
    </section>
  );
}

function Dt({ label, field }: { label: string; field: TSourcedString }) {
  const missing = field.value == null;
  return (
    <div className="border-b border-edge py-3.5">
      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</dt>
      <dd className={`mt-1.5 text-[15px] leading-relaxed ${missing ? "italic text-muted/70" : "text-ink"}`}>
        {field.value ?? "Not verified"}
        {field.source && (
          <a
            href={field.source}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 inline-flex items-center gap-0.5 align-middle text-xs font-medium text-violet hover:underline"
            aria-label={`Source for ${label}`}
          >
            <ArrowUpRight className="h-3 w-3" />
            Source
          </a>
        )}
      </dd>
    </div>
  );
}

function TwoCol({ children }: { children: React.ReactNode }) {
  return <dl className="grid gap-x-12 sm:grid-cols-2">{children}</dl>;
}

function FlowStep({ label, last = false }: { label: string; last?: boolean }) {
  return (
    <>
      <div className="rounded-2xl border border-violet/20 bg-white px-5 py-3 text-center text-[13px] font-semibold uppercase tracking-wider text-ink shadow-sm">
        {label}
      </div>
      {!last && <ArrowDown className="mx-auto h-4 w-4 text-violet/60" />}
    </>
  );
}

const SOURCE_KIND_LABEL: Record<string, string> = {
  website: "Official",
  doc: "Documentation",
  market: "Market",
  explorer: "Onchain",
  other: "Secondary",
};

/* ------------------------------------------------------------------ */
/* Passport                                                            */
/* ------------------------------------------------------------------ */

export default function Passport({ report }: { report: TReport }) {
  const p = report.passport;
  const id = p.identity;
  const active = useActiveSection();
  const [copiedContract, setCopiedContract] = useState(false);

  const confidenceLabel =
    report.scores.confidence >= 0.75 ? "High" : report.scores.confidence >= 0.5 ? "Medium" : "Limited";

  const keySignals: { tone: "plus" | "warn" | "unknown"; text: string }[] = [];
  if (p.asset.underlyingAsset.value) keySignals.push({ tone: "plus", text: "Identifiable underlying exposure" });
  if (p.redemption.available.value) keySignals.push({ tone: "plus", text: "Redemption mechanism documented" });
  const weakest = [...report.scores.categories].sort((a, b) => a.score - b.score)[0];
  if (weakest) keySignals.push({ tone: "warn", text: `${weakest.label} is the weakest researched dimension` });
  if (!p.custody.assetCustodian.value) keySignals.push({ tone: "unknown", text: "Custody detail incomplete" });
  if (!p.yield.reportedApy.value) keySignals.push({ tone: "unknown", text: "Yield not verified" });

  async function copyContract() {
    if (!p.token.contract.value) return;
    try {
      await navigator.clipboard.writeText(p.token.contract.value);
      setCopiedContract(true);
      setTimeout(() => setCopiedContract(false), 1600);
    } catch {}
  }

  return (
    <div className="print-root mx-auto max-w-[1360px] px-5 pb-28 sm:px-8">
      {/* ================= HEADER ================= */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="print-block rounded-[36px] border border-edge bg-white p-7 shadow-[0_50px_120px_-45px_rgba(140,92,255,0.4)] sm:p-12"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet">RWA Passport</span>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            <Link2 className="h-3.5 w-3.5 text-violet" />
            Verified sources · {p.sources.length}
          </span>
        </div>

        {report.demo && (
          <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-[13px] font-semibold text-amber-700">
            Demo — curated illustrative research, not live analysis
          </div>
        )}

        <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-violet to-violet-soft font-display text-2xl font-bold text-white">
              {monogram(id.ticker ?? id.name)}
            </div>
            <div>
              <h1 className="max-w-xl font-display text-[32px] font-bold leading-[1.08] tracking-tight text-ink sm:text-[42px]">
                {id.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2.5 text-[15px] text-muted">
                {id.ticker && (
                  <span className="rounded-full bg-body px-3 py-1 font-semibold text-ink">{id.ticker}</span>
                )}
                <span>{id.oneLiner}</span>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2 text-[13px] text-muted">
                {p.multichain.chains.slice(0, 4).map((c) => (
                  <span key={c.chain} className="rounded-full border border-edge px-3 py-1.5 font-medium">
                    {c.chain}
                  </span>
                ))}
                {id.category && <span className="rounded-full border border-edge px-3 py-1.5">{id.category}</span>}
                <span className="rounded-full border border-edge px-3 py-1.5">
                  Last researched {timeAgo(report.createdAt)}
                </span>
                {id.website && (
                  <a
                    href={id.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-edge px-3 py-1.5 font-medium text-violet hover:border-violet/40"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-7">
            <ScoreRing score={report.scores.overall} size={190} />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">RWA Score</p>
              <p className="mt-1.5 font-display text-2xl font-bold text-ink">{report.scores.label}</p>
              <p className="mt-3 text-[13px] text-muted">
                Research confidence
                <br />
                <span className="font-semibold text-ink">{confidenceLabel}</span>
              </p>
            </div>
          </div>
        </div>

        <p className="mt-8 max-w-2xl text-[13px] leading-relaxed text-muted/80">
          Research score measures transparency, structure, liquidity, redemption, custody and identified risk signals.
          Not investment advice.
        </p>

        {/* Integrated score strip */}
        <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-edge sm:grid-cols-4 lg:grid-cols-8">
          {report.scores.categories.map((c) => (
            <div key={c.key} className="bg-body/80 px-4 py-4" title={c.note ?? undefined}>
              <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-muted">{c.label}</p>
              <p className="mt-1 font-display text-[26px] font-bold leading-none text-ink">{c.score}</p>
              <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-edge">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-violet to-violet-soft"
                  initial={{ width: 0 }}
                  animate={{ width: `${c.score}%` }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <ExportButtons report={report} />
          <a
            href="#sources"
            className="no-print inline-flex items-center gap-1.5 text-[13px] font-medium text-violet hover:underline"
          >
            Jump to sources
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </motion.header>

      {/* ================= 3-COLUMN BODY ================= */}
      <div className="mt-10 lg:grid lg:grid-cols-[190px_minmax(0,1fr)_300px] lg:gap-10 xl:gap-14">
        {/* -------- Left: report navigation -------- */}
        <nav aria-label="Report sections" className="no-print hidden lg:block">
          <div className="sticky top-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted">Report</p>
            <ul className="mt-4 space-y-0.5">
              {NAV.map(([n, label, target]) => (
                <li key={target}>
                  <a
                    href={`#${target}`}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] transition-colors ${
                      active === target
                        ? "bg-violet-faint font-semibold text-ink"
                        : "text-muted hover:bg-body hover:text-ink"
                    }`}
                    aria-current={active === target ? "true" : undefined}
                  >
                    <span className={`text-[11px] font-bold ${active === target ? "text-violet" : "text-muted/60"}`}>
                      {n}
                    </span>
                    {label}
                    {active === target && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Mobile sticky horizontal nav */}
        <nav
          aria-label="Report sections"
          className="no-print sticky top-0 z-40 -mx-5 border-b border-edge bg-white/90 px-5 py-2.5 backdrop-blur-xl lg:hidden"
        >
          <div className="scroll-thin flex gap-1 overflow-x-auto">
            {NAV.map(([, label, target]) => (
              <a
                key={target}
                href={`#${target}`}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium ${
                  active === target ? "bg-violet-faint text-ink" : "text-muted"
                }`}
              >
                {label}
              </a>
            ))}
          </div>
        </nav>

        {/* -------- Center: the research document -------- */}
        <div className="min-w-0">
          {/* 01 Overview */}
          <section id="summary" className="print-block scroll-mt-32 pb-12 pt-2">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-violet">
              <Sparkles className="h-4 w-4" />
              AI Research Brief
            </p>
            <h2 className="mt-4 font-display text-[30px] font-bold leading-tight tracking-tight text-ink sm:text-[36px]">
              What this asset actually is.
            </h2>
            <p className="mt-6 text-[20px] leading-[1.65] text-ink/90 sm:text-[21px]">{p.summary}</p>
            <div className="mt-9 rounded-[28px] bg-violet-faint/80 p-8 sm:p-9">
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-violet">
                What you&apos;re actually buying
              </h3>
              <p className="mt-4 text-[17px] leading-relaxed text-ink">{p.whatYouAreBuying}</p>
            </div>

            {report.market && (
              <div className="mt-9 rounded-[28px] border border-edge p-7">
                <div className="flex items-center justify-between">
                  <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-muted">
                    <BarChart3 className="h-4 w-4 text-violet" />
                    Market snapshot
                  </p>
                  <a
                    href={report.market.topPair?.url ?? report.market.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-violet hover:underline"
                  >
                    <ArrowUpRight className="h-3 w-3" />
                    DexScreener
                  </a>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-6 sm:grid-cols-4">
                  {(
                    [
                      ["Price", report.market.priceUsd ? `$${report.market.priceUsd}` : "—"],
                      ["DEX Liquidity", formatUsd(report.market.liquidityUsd)],
                      ["24h Volume", formatUsd(report.market.volume24hUsd)],
                      ["DEX Pairs", String(report.market.pairCount)],
                    ] as const
                  ).map(([l, v]) => (
                    <div key={l}>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{l}</p>
                      <p className="mt-1 font-display text-xl font-bold text-ink">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* 02 Asset */}
          <DocSection number="02" title="Asset" id="asset">
            <TwoCol>
              <div>
                <Dt label="Underlying asset" field={p.asset.underlyingAsset} />
                <Dt label="Asset class" field={p.asset.assetClass} />
                <Dt label="Issuer" field={p.asset.issuer} />
                <Dt label="Currency" field={p.asset.currency} />
              </div>
              <div>
                <Dt label="Product structure" field={p.asset.productStructure} />
                <Dt label="Reported AUM" field={p.asset.reportedAum} />
                <Dt label="Yield mechanism" field={p.asset.yieldMechanism} />
              </div>
            </TwoCol>
          </DocSection>

          {/* 03 Token */}
          <DocSection number="03" title="Token" id="token">
            <div className="rounded-[28px] bg-[#F8F7FA] p-7 sm:p-8">
              <dl className="grid gap-x-12 sm:grid-cols-2">
                <div>
                  <Dt label="Symbol" field={p.token.symbol} />
                  <Dt label="Network" field={p.token.blockchain} />
                  <div className="border-b border-edge py-3.5">
                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Contract</dt>
                    <dd className="mt-1.5">
                      {p.token.contract.value ? (
                        <span className="inline-flex max-w-full items-center gap-2">
                          <code className="truncate rounded-lg bg-white px-2.5 py-1.5 font-mono text-[13px] text-ink ring-1 ring-edge">
                            {p.token.contract.value.length > 24
                              ? `${p.token.contract.value.slice(0, 12)}…${p.token.contract.value.slice(-8)}`
                              : p.token.contract.value}
                          </code>
                          <button
                            type="button"
                            onClick={copyContract}
                            aria-label="Copy contract address"
                            className="no-print inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-muted ring-1 ring-edge hover:text-violet"
                          >
                            {copiedContract ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                          {p.token.contract.source && (
                            <a
                              href={p.token.contract.source}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Contract source"
                              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-violet ring-1 ring-edge"
                            >
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </span>
                      ) : (
                        <span className="text-[15px] italic text-muted/70">Not verified</span>
                      )}
                    </dd>
                  </div>
                  <Dt label="Standard" field={p.token.standard} />
                </div>
                <div>
                  <Dt label="Transferability" field={p.token.transferability} />
                  <Dt label="Mint / burn" field={p.token.mintBurn} />
                  <Dt label="Supply" field={p.token.supply} />
                </div>
              </dl>
            </div>
          </DocSection>

          {/* 04 Yield */}
          <DocSection number="04" title="Yield" id="yield">
            <TwoCol>
              <div>
                <Dt label="Reported yield" field={p.yield.reportedApy} />
                <Dt label="Yield source" field={p.yield.source} />
              </div>
              <div>
                <Dt label="Distribution" field={p.yield.distribution} />
              </div>
            </TwoCol>
            {p.yield.sustainability && (
              <p className="mt-6 text-[15px] leading-relaxed text-ink/80">{p.yield.sustainability}</p>
            )}
            {!p.yield.reportedApy.value && (
              <p className="mt-5 text-[13px] italic text-muted/80">
                TokenRWA does not estimate or infer yield when reliable data is unavailable.
              </p>
            )}
          </DocSection>

          {/* 05 Redemption */}
          <DocSection number="05" title="Redemption" id="redemption">
            <div className="grid gap-10 sm:grid-cols-[200px_1fr]">
              <div className="mx-auto w-full max-w-[200px] space-y-2 self-start rounded-[24px] bg-violet-faint/60 p-5" aria-hidden="true">
                <FlowStep label="Token" />
                <FlowStep label="Redemption request" />
                <FlowStep label="Issuer / fund" />
                <FlowStep label="USD / value" last />
              </div>
              <dl>
                <Dt label="Available" field={p.redemption.available} />
                <Dt label="Minimum" field={p.redemption.minimum} />
                <Dt label="Settlement" field={p.redemption.settlementTime} />
                <Dt label="Currency" field={p.redemption.currency} />
                <Dt label="Restrictions" field={p.redemption.restrictions} />
              </dl>
            </div>
            {p.redemption.primaryVsSecondary && (
              <p className="mt-6 text-[15px] leading-relaxed text-ink/80">{p.redemption.primaryVsSecondary}</p>
            )}
          </DocSection>

          {/* 06 Custody */}
          <DocSection number="06" title="Custody" id="custody">
            <div className="grid gap-10 sm:grid-cols-[200px_1fr]">
              <div className="mx-auto w-full max-w-[200px] space-y-2 self-start rounded-[24px] bg-[#FFF4EC]/70 p-5" aria-hidden="true">
                <FlowStep label="Token holder" />
                <FlowStep label="Issuer" />
                <FlowStep label="Custodian" />
                <FlowStep label="Underlying asset" last />
              </div>
              <dl>
                <Dt label="Asset custodian" field={p.custody.assetCustodian} />
                <Dt label="Token custody" field={p.custody.tokenCustodyDependencies} />
                <Dt label="Service providers" field={p.custody.serviceProviders} />
                <Dt label="Offchain dependencies" field={p.custody.offchainDependencies} />
              </dl>
            </div>
          </DocSection>

          {/* 07 Legal */}
          <DocSection number="07" title="Legal Structure" id="legal">
            <TwoCol>
              <div>
                <Dt label="Jurisdiction" field={p.legal.jurisdiction} />
                <Dt label="Structure" field={p.legal.structure} />
                <Dt label="Eligibility" field={p.legal.eligibility} />
              </div>
              <div>
                <Dt label="KYC" field={p.legal.kyc} />
                <Dt label="Transfer restrictions" field={p.legal.transferRestrictions} />
                <Dt label="Regulatory notes" field={p.legal.regulatoryNotes} />
              </div>
            </TwoCol>
            <p className="mt-5 text-[13px] italic text-muted/80">
              TokenRWA summarizes publicly available information. This is not legal advice.
            </p>
          </DocSection>

          {/* 08 Liquidity */}
          <DocSection number="08" title="Liquidity" id="liquidity">
            <div className="grid gap-px overflow-hidden rounded-[24px] bg-edge sm:grid-cols-2">
              {(
                [
                  ["Primary liquidity", p.liquidity.primaryRedemption],
                  ["Secondary liquidity", p.liquidity.dexCexAvailability],
                  ["Market depth", p.liquidity.reportedLiquidity],
                  ["Concentration", p.liquidity.concentration],
                ] as const
              ).map(([l, f]) => (
                <div key={l} className="bg-white p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{l}</p>
                  <p className={`mt-2 text-[15px] leading-relaxed ${f.value ? "text-ink" : "italic text-muted/70"}`}>
                    {f.value ?? (l === "Market depth" ? "Market data unavailable" : "Not verified")}
                    {f.source && (
                      <a
                        href={f.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 inline-flex items-center gap-0.5 align-middle text-xs font-medium text-violet hover:underline"
                      >
                        <ArrowUpRight className="h-3 w-3" />
                        Source
                      </a>
                    )}
                  </p>
                </div>
              ))}
            </div>
            <dl className="mt-6">
              <Dt label="Available markets" field={p.liquidity.markets} />
            </dl>
            {p.liquidity.limitations && (
              <p className="mt-5 text-[15px] leading-relaxed text-ink/80">{p.liquidity.limitations}</p>
            )}
          </DocSection>

          {/* 09 Multichain */}
          <DocSection number="09" title="Multichain" id="multichain">
            <div className="flex flex-wrap gap-2.5">
              {p.multichain.chains.length > 0 ? (
                p.multichain.chains.map((c) => <ChainPill key={c.chain} chain={c.chain} interop={c.interoperability} />)
              ) : (
                <p className="text-[15px] italic text-muted">Network availability not verified.</p>
              )}
            </div>
            {p.multichain.notes && <p className="mt-5 text-[15px] leading-relaxed text-ink/80">{p.multichain.notes}</p>}
          </DocSection>

          {/* 10 Risks */}
          <DocSection number="10" title="Risks" id="risks">
            <div className="overflow-hidden rounded-[24px] ring-1 ring-edge">
              {p.risks.map((r, i) => (
                <div key={r.category} className={`p-6 ${i % 2 === 0 ? "bg-white" : "bg-[#FAF9FC]"}`}>
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-[16px] font-semibold text-ink">{r.category}</h3>
                    <RiskBadge level={r.level} />
                  </div>
                  <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink/75">{r.explanation}</p>
                </div>
              ))}
            </div>
          </DocSection>

          {/* 11 Diligence */}
          <DocSection number="11" title="Due Diligence" id="diligence">
            {p.redFlags.length > 0 && (
              <>
                <h3 className="font-display text-xl font-bold tracking-tight text-ink">
                  What deserves a closer look.
                </h3>
                <div className="mt-6 space-y-4">
                  {p.redFlags.map((f, i) => (
                    <div key={i} className="flex gap-5 rounded-[24px] bg-[#FFF7F0] p-6">
                      <span className="font-display text-lg font-bold text-[#C2703F]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-[#C2703F]" />
                        <p className="text-[15px] leading-relaxed text-ink/85">{f}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <h3 className={`font-display text-xl font-bold tracking-tight text-ink ${p.redFlags.length > 0 ? "mt-12" : ""}`}>
              Questions worth asking before going further.
            </h3>
            <div className="mt-6 divide-y divide-edge">
              {p.questionsToAsk.map((q, i) => (
                <div key={i} className="group flex items-center justify-between gap-6 py-5">
                  <p className="flex gap-4 text-[16px] font-medium leading-relaxed text-ink sm:text-[17px]">
                    <span className="font-display text-sm font-bold text-violet">{String(i + 1).padStart(2, "0")}</span>
                    {q}
                  </p>
                  <button
                    type="button"
                    onClick={() => askAI(q)}
                    className="no-print inline-flex shrink-0 items-center gap-1.5 rounded-full border border-edge px-4 py-2 text-[13px] font-semibold text-muted transition-colors hover:border-violet hover:text-violet"
                  >
                    Ask TokenRWA
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </DocSection>

          {/* 12 Sources */}
          <DocSection number="12" title="Sources" id="sources">
            {p.sources.length > 0 ? (
              <div className="space-y-3">
                {p.sources.map((s, i) => (
                  <a
                    key={s.url}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-5 rounded-[22px] border border-edge bg-white px-6 py-[18px] transition-colors hover:border-violet/40"
                  >
                    <span className="font-display text-sm font-bold text-violet">{String(i + 1).padStart(2, "0")}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-semibold text-ink">
                        {s.title ?? new URL(s.url).hostname}
                      </p>
                      <p className="truncate text-[13px] text-muted">{s.url}</p>
                    </div>
                    <span className="hidden rounded-full bg-body px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-muted sm:inline-flex">
                      {SOURCE_KIND_LABEL[s.kind] ?? "Secondary"}
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-violet" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-[15px] italic text-muted">No external sources were used for this report.</p>
            )}
          </DocSection>

          {/* Ask AI */}
          <div className="mt-4">
            <ReportChat report={report} />
          </div>
        </div>

        {/* -------- Right: intelligence sidebar -------- */}
        <aside className="no-print hidden lg:block">
          <div className="sticky top-8 space-y-5">
            <div className="rounded-[26px] border border-edge bg-white p-6 shadow-card">
              <div className="flex items-baseline justify-between">
                <span className="font-display text-5xl font-bold tracking-tight text-ink">{report.scores.overall}</span>
                <span className="rounded-full bg-violet px-3 py-1 text-[13px] font-semibold text-white">
                  {report.scores.label}
                </span>
              </div>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">RWA Score</p>
              <div className="mt-5 space-y-2.5 border-t border-edge pt-4 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-muted">Research confidence</span>
                  <span className="font-semibold text-ink">{confidenceLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Sources</span>
                  <span className="font-semibold text-ink">{p.sources.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Updated</span>
                  <span className="font-semibold text-ink">{timeAgo(report.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border border-edge bg-white p-6 shadow-card">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">Key signals</p>
              <ul className="mt-4 space-y-3">
                {keySignals.slice(0, 5).map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-ink/85">
                    <span
                      className={`mt-0.5 font-bold ${
                        s.tone === "plus" ? "text-emerald-600" : s.tone === "warn" ? "text-amber-600" : "text-muted"
                      }`}
                    >
                      {s.tone === "plus" ? "+" : s.tone === "warn" ? "!" : "?"}
                    </span>
                    {s.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[26px] bg-night p-6">
              <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/60">
                <MessageCircle className="h-3.5 w-3.5 text-violet-soft" />
                Ask TokenRWA
              </p>
              <SidebarAsk />
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile floating Ask AI */}
      <a
        href="#ask-ai"
        className="no-print fixed bottom-6 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-violet px-5 py-3.5 text-sm font-semibold text-white shadow-lift lg:hidden"
      >
        <MessageCircle className="h-4 w-4" />
        Ask AI
      </a>
    </div>
  );
}

function SidebarAsk() {
  const [q, setQ] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (q.trim()) {
          askAI(q.trim());
          setQ("");
        }
      }}
      className="mt-4"
    >
      <label htmlFor="sidebar-ask" className="sr-only">
        Ask about this asset
      </label>
      <input
        id="sidebar-ask"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Ask about this asset…"
        className="w-full rounded-2xl border border-white/15 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-violet-soft/60"
      />
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["Why this score?", "How does redemption work?", "Biggest risk?"].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => askAI(s)}
            className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] text-white/70 transition-colors hover:border-violet-soft/50 hover:text-white"
          >
            {s}
          </button>
        ))}
      </div>
    </form>
  );
}
