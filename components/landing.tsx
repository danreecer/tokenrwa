"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ClipboardPaste,
  FileSearch,
  FileText,
  GitCompareArrows,
  HelpCircle,
  Lightbulb,
  Link2,
  MessageCircleQuestion,
  Microscope,
  ScanSearch,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";
import AnalyzeBar from "@/components/analyze-bar";
import RecentResearch from "@/components/recent-research";
import { LogoMark } from "@/components/logo";

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

function Pill({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
        dark ? "border-white/15 bg-white/5 text-violet-lilac" : "border-edge bg-white text-muted"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dark ? "bg-violet-soft" : "bg-violet"}`} />
      {children}
    </span>
  );
}

/* Hero background: the supplied TokenRWA artwork, blended with overlays for text
   contrast on the left and a soft fade into the white body below. */
function HeroBackground() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Image
        src="/images/tokenrwa-hero-bg.png"
        alt=""
        fill
        priority
        quality={90}
        sizes="100vw"
        className="object-cover object-[68%_center] lg:object-[center_right]"
      />
      {/* left readability gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,7,9,0.92)_0%,rgba(7,7,9,0.62)_34%,rgba(7,7,9,0.18)_62%,rgba(7,7,9,0.04)_100%)]" />
      {/* stronger wash on small screens where text sits over artwork */}
      <div className="absolute inset-0 bg-[rgba(7,7,9,0.38)] lg:hidden" />
      {/* top darkening under the nav */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/70 to-transparent" />
      {/* bottom bloom → lavender → white transition into the body */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(180deg,transparent_0%,rgba(245,240,255,0.35)_55%,rgba(255,255,255,0.92)_92%,#ffffff_100%)]" />
    </div>
  );
}

/* Mini structured passport used in the problem section. */
function MiniPassport() {
  return (
    <div className="w-full max-w-md rounded-[28px] border border-violet/15 bg-white p-7 shadow-lift">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-violet">
          <Sparkles className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-[0.16em]">RWA Passport</span>
        </div>
        <span className="rounded-full bg-violet-faint px-3 py-1 text-xs font-semibold text-violet">Structured</span>
      </div>
      <div className="mt-5 space-y-2.5">
        {[
          ["Issuer", "w-24"],
          ["Backing", "w-32"],
          ["Custodian", "w-20"],
          ["Yield", "w-16"],
          ["Redemption", "w-28"],
          ["Liquidity", "w-24"],
          ["Legal structure", "w-20"],
        ].map(([l, w]) => (
          <div key={l} className="flex items-center justify-between rounded-2xl bg-body px-4 py-3">
            <span className="text-sm font-medium text-ink">{l}</span>
            <span className={`h-2 rounded-full bg-gradient-to-r from-violet-soft to-violet-lilac ${w}`} />
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between rounded-2xl bg-night px-4 py-3.5">
        <span className="text-sm font-medium text-white/80">RWA Score</span>
        <span className="font-display text-lg font-bold text-white">
          82 <span className="text-xs font-medium text-white/50">/ 100</span>
        </span>
      </div>
    </div>
  );
}

const FRAGMENTS = [
  { label: "Issuer", cls: "left-[2%] top-[4%] -rotate-6" },
  { label: "Custodian", cls: "left-[34%] top-0 rotate-3" },
  { label: "Contract", cls: "left-[64%] top-[10%] -rotate-2" },
  { label: "Yield", cls: "left-[12%] top-[26%] rotate-2" },
  { label: "Liquidity", cls: "left-[46%] top-[30%] -rotate-3" },
  { label: "Redemption", cls: "left-[74%] top-[38%] rotate-6" },
  { label: "Jurisdiction", cls: "left-[4%] top-[54%] rotate-1" },
  { label: "Backing", cls: "left-[38%] top-[58%] -rotate-2" },
  { label: "Audit", cls: "left-[66%] top-[66%] rotate-3" },
  { label: "Networks", cls: "left-[22%] top-[80%] -rotate-3" },
];

export default function Landing() {
  return (
    <div className="overflow-x-clip bg-white">
      {/* ==================== SECTION 1 — HERO ==================== */}
      <section className="relative overflow-hidden bg-[#070709]" id="analyze">
        <HeroBackground />
        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-shell flex-col justify-center px-5 pb-28 pt-32 sm:px-10 sm:pt-36">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Pill dark>AI research for tokenized assets</Pill>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mt-8 font-display text-[52px] font-bold leading-[0.98] tracking-[-0.03em] text-white sm:text-[72px] xl:text-[88px]"
            >
              Understand Any
              <br />
              Tokenized{" "}
              <span className="bg-gradient-to-r from-violet-soft via-violet-lilac to-blush bg-clip-text text-transparent">
                Asset
              </span>
              <br />
              In Seconds.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-8 max-w-md text-lg leading-relaxed text-white/75"
            >
              Turn fragmented information about tokenized assets into one structured AI research report.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mx-auto mt-20 w-full max-w-[880px]"
          >
            <AnalyzeBar dark hero />
            <p className="mt-5 text-center text-[13px] text-white/60">No account required · Free during beta</p>
          </motion.div>
        </div>
      </section>

      {/* Recent research (localStorage, hidden when empty) */}
      <RecentResearch />

      {/* ==================== SECTION 2 — THE PROBLEM ==================== */}
      <section className="mx-auto max-w-shell px-5 pb-32 pt-28 sm:px-10">
        <motion.div {...fadeUp}>
          <Pill>Why TokenRWA</Pill>
        </motion.div>
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-24">
          <motion.h2
            {...fadeUp}
            className="font-display text-[44px] font-bold leading-[1.02] tracking-[-0.025em] text-ink sm:text-[60px] xl:text-[72px]"
          >
            Tokenization is easy.
            <br />
            <span className="text-muted">Understanding the</span>
            <br />
            <span className="text-muted">asset still isn&apos;t.</span>
          </motion.h2>
          <motion.div {...fadeUp} className="flex flex-col justify-end">
            <p className="max-w-sm text-lg leading-relaxed text-muted">
              RWA information is fragmented across issuer websites, contracts, documentation, block explorers and
              market venues. TokenRWA turns that fragmentation into one structured research layer.
            </p>
          </motion.div>
        </div>

        {/* fragmentation → structure */}
        <motion.div {...fadeUp} className="mt-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_auto_1fr]">
            <div className="relative mx-auto h-[380px] w-full max-w-xl" aria-hidden="true">
              {FRAGMENTS.map((f, i) => (
                <div
                  key={f.label}
                  className={`absolute flex items-center gap-2.5 rounded-2xl border border-edge bg-white px-5 py-3.5 shadow-card ${f.cls}`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      i % 3 === 0 ? "bg-violet" : i % 3 === 1 ? "bg-blush" : "bg-violet-soft"
                    }`}
                  />
                  <span className="text-[15px] font-medium text-ink/80">{f.label}</span>
                </div>
              ))}
              {/* faint scatter dots */}
              <div className="absolute left-[55%] top-[78%] h-3 w-3 rounded-full bg-violet-lilac" />
              <div className="absolute left-[88%] top-[24%] h-2 w-2 rounded-full bg-blush/70" />
              <div className="absolute left-[8%] top-[40%] h-2 w-2 rounded-full bg-violet-soft/60" />
            </div>
            <div className="hidden items-center justify-center lg:flex" aria-hidden="true">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-violet text-white shadow-lift">
                <ArrowRight className="h-6 w-6" />
              </span>
            </div>
            <div className="mx-auto w-full max-w-md">
              <MiniPassport />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ==================== SECTION 3 — RWA PASSPORT SHOWCASE ==================== */}
      <section className="relative overflow-visible bg-body pb-36 pt-32">
        <div className="orb left-[-8%] top-[10%] h-96 w-96 bg-violet-lilac/40" aria-hidden="true" />
        <div className="orb right-[-6%] top-[55%] h-80 w-80 bg-blush/30" aria-hidden="true" />
        <div className="relative mx-auto max-w-shell px-5 sm:px-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
            <motion.div {...fadeUp}>
              <Pill>One report</Pill>
              <h2 className="mt-8 font-display text-[44px] font-bold leading-[1.02] tracking-[-0.025em] text-ink sm:text-[56px] xl:text-[68px]">
                Everything that matters.
                <br />
                One RWA Passport.
              </h2>
            </motion.div>
            <motion.p {...fadeUp} className="max-w-md self-end text-lg leading-relaxed text-muted">
              Turn issuer data, token mechanics, liquidity, custody, redemption and risk signals into one structured
              research layer — with the questions you should be asking.
            </motion.p>
          </div>

          {/* HUGE passport mockup */}
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto mt-20 max-w-[1150px]"
          >
            <div className="rounded-[36px] border border-edge bg-white p-6 shadow-[0_60px_140px_-50px_rgba(140,92,255,0.5)] sm:p-12">
              {/* header row */}
              <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-5">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-violet to-violet-soft font-display text-2xl font-bold text-white">
                    ET
                  </div>
                  <div>
                    <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-700">
                      Demo asset
                    </span>
                    <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                      Example Treasury Token
                    </h3>
                    <p className="mt-1.5 text-base text-muted">Tokenized U.S. Treasury exposure</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {["Ethereum", "Treasury", "Demo"].map((t) => (
                        <span key={t} className="rounded-full bg-body px-3.5 py-1.5 text-[13px] font-medium text-ink/70">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 rounded-3xl bg-gradient-to-br from-violet-faint to-white p-6 lg:p-7">
                  <div>
                    <p className="font-display text-6xl font-bold tracking-tight text-ink">
                      82<span className="text-2xl text-muted">/100</span>
                    </p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-muted">RWA Score</p>
                  </div>
                  <span className="rounded-full bg-violet px-4 py-1.5 text-sm font-semibold text-white">Strong</span>
                </div>
              </div>

              {/* body grid */}
              <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                <div className="space-y-6">
                  <div className="rounded-3xl bg-violet-faint/70 p-7">
                    <div className="flex items-center gap-2 text-violet">
                      <Sparkles className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase tracking-[0.16em]">AI Summary</span>
                    </div>
                    <p className="mt-3.5 text-[15px] leading-relaxed text-ink/85">
                      Tokenized exposure to short-duration government securities with identifiable backing, established
                      service providers and instant primary redemption within program limits…
                    </p>
                  </div>
                  <div className="rounded-3xl bg-[#FFF4EC] p-7">
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#C2703F]">
                      What you&apos;re actually buying
                    </span>
                    <p className="mt-3.5 text-[15px] leading-relaxed text-ink/85">
                      Economically similar to a short-term government money-market position, wrapped in a transferable
                      token with issuer-managed mint and redemption…
                    </p>
                  </div>
                  <div className="flex items-center justify-between rounded-3xl border border-edge p-7">
                    <div className="flex items-center gap-3">
                      <Link2 className="h-5 w-5 text-violet" />
                      <span className="text-[15px] font-semibold text-ink">Sources</span>
                    </div>
                    <span className="font-display text-2xl font-bold text-ink">8</span>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="rounded-3xl border border-edge p-7">
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Category scores</span>
                    <div className="mt-5 space-y-4">
                      {[
                        ["Transparency", 92],
                        ["Asset Backing", 91],
                        ["Liquidity", 76],
                        ["Redemption", 84],
                      ].map(([l, v]) => (
                        <div key={l as string}>
                          <div className="flex items-baseline justify-between">
                            <span className="text-sm font-medium text-ink">{l}</span>
                            <span className="font-display text-base font-bold text-ink">{v}</span>
                          </div>
                          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-violet-faint">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-violet to-violet-soft"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${v}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-3xl bg-night p-7">
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">Risk signals</span>
                    <div className="mt-5 space-y-3.5">
                      {[
                        ["Liquidity", "Moderate", "bg-amber-400/15 text-amber-300"],
                        ["Custody", "Low", "bg-emerald-400/15 text-emerald-300"],
                        ["Contract", "Moderate", "bg-amber-400/15 text-amber-300"],
                      ].map(([l, v, c]) => (
                        <div key={l as string} className="flex items-center justify-between">
                          <span className="text-[15px] text-white/85">{l}</span>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${c}`}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-8 text-[13px] text-muted/80">
                Illustrative demo — not research on a real project. Run an analysis to generate a live Passport.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== SECTION 4 — FEATURES ==================== */}
      <section className="mx-auto max-w-shell px-5 py-32 sm:px-10">
        <motion.div {...fadeUp} className="max-w-3xl">
          <Pill>What you get</Pill>
          <h2 className="mt-8 font-display text-[40px] font-bold leading-[1.05] tracking-[-0.025em] text-ink sm:text-[52px] xl:text-[60px]">
            Research that reads like a briefing, not a dashboard.
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {/* Research — large card spanning 2 rows */}
          <motion.div
            {...fadeUp}
            className="group relative overflow-hidden rounded-[32px] bg-gradient-to-b from-violet-faint via-white to-white p-9 shadow-card ring-1 ring-edge transition-transform hover:-translate-y-1 lg:row-span-2"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet text-white">
              <FileSearch className="h-6 w-6" />
            </span>
            <h3 className="mt-6 font-display text-[28px] font-bold tracking-tight text-ink">Research</h3>
            <p className="mt-2.5 max-w-xs text-base leading-relaxed text-muted">
              AI turns fragmented sources into structured intelligence.
            </p>
            {/* raw text → structured visual */}
            <div className="mt-9 space-y-3">
              <div className="rounded-2xl border border-dashed border-edge bg-white p-4">
                <div className="space-y-1.5 opacity-60">
                  <div className="h-1.5 w-full rounded-full bg-ink/10" />
                  <div className="h-1.5 w-4/5 rounded-full bg-ink/10" />
                  <div className="h-1.5 w-5/6 rounded-full bg-ink/10" />
                  <div className="h-1.5 w-3/5 rounded-full bg-ink/10" />
                </div>
                <p className="mt-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted/70">Raw sources</p>
              </div>
              <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-violet/10 text-violet">
                <ArrowRight className="h-4 w-4 rotate-90" />
              </div>
              <div className="rounded-2xl border border-violet/20 bg-white p-4 shadow-card">
                {[
                  ["Backing", "US Treasuries"],
                  ["Redemption", "Daily · USDC"],
                  ["Custody", "Named custodian"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between border-b border-edge py-2 text-sm last:border-0">
                    <span className="font-medium text-muted">{k}</span>
                    <span className="font-semibold text-ink">{v}</span>
                  </div>
                ))}
                <p className="mt-2.5 text-[11px] font-semibold uppercase tracking-wider text-violet">Structured research</p>
              </div>
            </div>
          </motion.div>

          {/* Risk signals */}
          <motion.div
            {...fadeUp}
            className="rounded-[32px] bg-white p-9 shadow-card ring-1 ring-edge transition-transform hover:-translate-y-1"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet/10 text-violet">
              <ShieldAlert className="h-6 w-6" />
            </span>
            <h3 className="mt-6 font-display text-[26px] font-bold tracking-tight text-ink">Risk Signals</h3>
            <p className="mt-2.5 text-base leading-relaxed text-muted">Surface what deserves a closer look.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-50 px-3.5 py-1.5 text-[13px] font-semibold text-emerald-700">Custody · Low</span>
              <span className="rounded-full bg-amber-50 px-3.5 py-1.5 text-[13px] font-semibold text-amber-700">Liquidity · Moderate</span>
              <span className="rounded-full bg-rose-50 px-3.5 py-1.5 text-[13px] font-semibold text-rose-700">Bridge · Elevated</span>
            </div>
          </motion.div>

          {/* Ask AI */}
          <motion.div
            {...fadeUp}
            className="rounded-[32px] bg-night p-9 shadow-card transition-transform hover:-translate-y-1"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-violet-soft">
              <MessageCircleQuestion className="h-6 w-6" />
            </span>
            <h3 className="mt-6 font-display text-[26px] font-bold tracking-tight text-white">Ask AI</h3>
            <p className="mt-2.5 text-base leading-relaxed text-white/60">
              Question the research instead of reading 40 tabs.
            </p>
            <div className="mt-6 space-y-3">
              <div className="ml-auto w-fit max-w-full rounded-2xl bg-violet px-4 py-2.5 text-sm text-white">
                What is the biggest redemption risk?
              </div>
              <div className="w-fit max-w-full rounded-2xl bg-white/10 px-4 py-2.5 text-sm text-white/85">
                Instant redemption is capped by program limits, so larger exits…
              </div>
            </div>
          </motion.div>

          {/* Compare */}
          <motion.div
            {...fadeUp}
            className="rounded-[32px] bg-white p-9 shadow-card ring-1 ring-edge transition-transform hover:-translate-y-1"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet/10 text-violet">
              <GitCompareArrows className="h-6 w-6" />
            </span>
            <h3 className="mt-6 font-display text-[26px] font-bold tracking-tight text-ink">Compare</h3>
            <p className="mt-2.5 text-base leading-relaxed text-muted">See how tokenized assets differ side by side.</p>
            <div className="mt-6 grid grid-cols-3 gap-2.5">
              {[
                ["OU", "76"],
                ["BU", "80"],
                ["US", "72"],
              ].map(([m, s]) => (
                <div key={m} className="rounded-2xl border border-edge bg-body/60 p-3 text-center">
                  <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet to-violet-soft text-[11px] font-bold text-white">
                    {m}
                  </div>
                  <p className="mt-2 font-display text-lg font-bold text-ink">{s}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Sources — wide */}
          <motion.div
            {...fadeUp}
            className="rounded-[32px] bg-gradient-to-br from-[#FFF4EC] to-white p-9 shadow-card ring-1 ring-edge transition-transform hover:-translate-y-1 lg:col-span-2"
          >
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-xs">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C2703F]/10 text-[#C2703F]">
                  <Link2 className="h-6 w-6" />
                </span>
                <h3 className="mt-6 font-display text-[26px] font-bold tracking-tight text-ink">Sources</h3>
                <p className="mt-2.5 text-base leading-relaxed text-muted">See where important information came from.</p>
              </div>
              <div className="w-full max-w-sm space-y-2.5">
                {[
                  ["ondo.finance", "Issuer website"],
                  ["docs.ondo.finance", "Documentation"],
                  ["dexscreener.com", "Market data"],
                ].map(([u, k]) => (
                  <div key={u} className="flex items-center justify-between rounded-2xl border border-edge bg-white px-5 py-3.5">
                    <div>
                      <p className="text-sm font-semibold text-ink">{u}</p>
                      <p className="text-xs text-muted">{k}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-violet" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== SECTION 5 — HOW IT WORKS ==================== */}
      <section className="bg-[#F8F7FA] py-32">
        <div className="mx-auto max-w-shell px-5 sm:px-10">
          <motion.div {...fadeUp} className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Pill>How it works</Pill>
              <h2 className="mt-8 font-display text-[40px] font-bold leading-[1.05] tracking-[-0.025em] text-ink sm:text-[52px]">
                Three steps to clarity.
              </h2>
            </div>
            <p className="max-w-xs text-base leading-relaxed text-muted">
              From a pasted link to a structured research report in under a minute.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {/* 01 Paste */}
            <motion.div {...fadeUp} className="flex flex-col rounded-[32px] bg-white p-9 shadow-card ring-1 ring-edge">
              <span className="font-display text-[88px] font-bold leading-none tracking-tight text-violet-lilac">01</span>
              <h3 className="mt-6 flex items-center gap-3 font-display text-[28px] font-bold tracking-tight text-ink">
                <ClipboardPaste className="h-6 w-6 text-violet" />
                Paste
              </h3>
              <p className="mt-2.5 text-base leading-relaxed text-muted">Website, contract, ticker or asset.</p>
              <div className="mt-8 flex items-center gap-3 rounded-2xl border border-edge bg-body/70 px-5 py-4">
                <ScanSearch className="h-4 w-4 shrink-0 text-violet" />
                <span className="truncate text-sm text-muted">https://ondo.finance</span>
                <span className="ml-auto rounded-xl bg-violet px-3.5 py-1.5 text-xs font-semibold text-white">Analyze</span>
              </div>
            </motion.div>

            {/* 02 Research */}
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.12 }}
              className="flex flex-col rounded-[32px] bg-white p-9 shadow-card ring-1 ring-edge"
            >
              <span className="font-display text-[88px] font-bold leading-none tracking-tight text-violet-lilac">02</span>
              <h3 className="mt-6 flex items-center gap-3 font-display text-[28px] font-bold tracking-tight text-ink">
                <FileSearch className="h-6 w-6 text-violet" />
                Research
              </h3>
              <p className="mt-2.5 text-base leading-relaxed text-muted">
                TokenRWA structures the available public information.
              </p>
              <div className="mt-8 space-y-2.5">
                {["Reading sources", "Mapping structure", "Checking liquidity"].map((s, i) => (
                  <div key={s} className="flex items-center gap-3 rounded-2xl bg-body/70 px-5 py-3">
                    <span className={`h-2 w-2 rounded-full ${i === 0 ? "bg-violet" : i === 1 ? "bg-violet-soft" : "bg-blush"}`} />
                    <span className="text-sm font-medium text-ink/75">{s}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 03 Understand */}
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.24 }}
              className="flex flex-col rounded-[32px] bg-white p-9 shadow-card ring-1 ring-edge"
            >
              <span className="font-display text-[88px] font-bold leading-none tracking-tight text-violet-lilac">03</span>
              <h3 className="mt-6 flex items-center gap-3 font-display text-[28px] font-bold tracking-tight text-ink">
                <Lightbulb className="h-6 w-6 text-violet" />
                Understand
              </h3>
              <p className="mt-2.5 text-base leading-relaxed text-muted">
                Receive your RWA Passport and ask follow-up questions.
              </p>
              <div className="mt-8 rounded-2xl bg-gradient-to-br from-violet-faint to-white p-5 ring-1 ring-violet/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-violet">RWA Passport</span>
                  <span className="font-display text-xl font-bold text-ink">82</span>
                </div>
                <div className="mt-3 space-y-1.5">
                  <div className="h-1.5 w-full rounded-full bg-violet-lilac/60" />
                  <div className="h-1.5 w-3/4 rounded-full bg-violet-lilac/45" />
                  <div className="h-1.5 w-5/6 rounded-full bg-violet-lilac/30" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 6 — MULTICHAIN ==================== */}
      <section className="mx-auto max-w-shell px-5 py-32 sm:px-10">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div {...fadeUp}>
            <Pill>Multichain</Pill>
            <h2 className="mt-8 font-display text-[40px] font-bold leading-[1.05] tracking-[-0.025em] text-ink sm:text-[56px]">
              Real-world assets
              <br />
              <span className="text-muted">don&apos;t live on one chain.</span>
            </h2>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-muted">
              Research assets across multiple blockchain ecosystems from one interface.
            </p>
            <p className="mt-4 max-w-md text-[13px] leading-relaxed text-muted/70">
              Networks the research system can categorize and search — not partnerships or integrations.
            </p>
          </motion.div>

          {/* orbital constellation */}
          <motion.div {...fadeUp} className="relative mx-auto h-[420px] w-[420px] max-w-full" aria-hidden="true">
            <div className="orbit-ring inset-[26%]" />
            <div className="orbit-ring inset-[6%]" />
            {/* center */}
            <div className="absolute left-1/2 top-1/2 z-10 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-full bg-night shadow-lift">
              <LogoMark className="h-7 w-7 text-violet-soft" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">TokenRWA</span>
            </div>
            {/* inner orbit */}
            <div className="spin-slow absolute inset-[26%]">
              {[
                ["Ethereum", "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"],
                ["Solana", "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"],
                ["Base", "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"],
              ].map(([c, pos]) => (
                <span key={c} className={`absolute ${pos}`}>
                  <span className="spin-slower inline-flex items-center gap-2 rounded-full border border-edge bg-white px-4 py-2 text-sm font-semibold text-ink shadow-card">
                    <span className="h-2 w-2 rounded-full bg-violet" />
                    {c}
                  </span>
                </span>
              ))}
            </div>
            {/* outer orbit */}
            <div className="spin-slower absolute inset-[6%]">
              {[
                ["Arbitrum", "top-[8%] left-[82%]"],
                ["Avalanche", "top-[78%] left-[88%] -translate-x-full"],
                ["Polygon", "top-[88%] left-[18%]"],
                ["BNB Chain", "top-[12%] left-[4%]"],
              ].map(([c, pos]) => (
                <span key={c} className={`absolute ${pos}`}>
                  <span className="spin-slow inline-flex items-center gap-2 rounded-full border border-edge bg-white px-4 py-2 text-sm font-semibold text-ink shadow-card">
                    <span className="h-2 w-2 rounded-full bg-blush" />
                    {c}
                  </span>
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== SECTION 7 — PRICING ==================== */}
      <section className="bg-[#F6F5F7] py-32">
        <div className="mx-auto max-w-shell px-5 sm:px-10">
          <motion.div {...fadeUp} className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Pill>Pay as you go</Pill>
              <h2 className="mt-8 font-display text-[40px] font-bold leading-[1.05] tracking-[-0.025em] text-ink sm:text-[56px]">
                Research without
                <br />
                another subscription.
              </h2>
            </div>
            <p className="max-w-xs text-lg leading-relaxed text-muted">Pay only when you need research.</p>
          </motion.div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { name: "Quick Scan", price: "$0.50", copy: "Fast structural overview.", icon: Zap, bg: "bg-white" },
              {
                name: "Full Passport",
                price: "$2.00",
                copy: "Complete AI RWA research.",
                icon: FileText,
                featured: true,
              },
              { name: "Compare", price: "$3.00", copy: "Compare up to three assets.", icon: GitCompareArrows, bg: "bg-gradient-to-b from-violet-faint/70 to-white" },
              { name: "Deep Research", price: "$5.00", copy: "Expanded diligence report.", icon: Microscope, bg: "bg-gradient-to-b from-[#FFF4EC]/80 to-white" },
            ].map((t) => (
              <motion.div
                key={t.name}
                {...fadeUp}
                className={`flex flex-col rounded-[32px] p-9 shadow-card transition-transform hover:-translate-y-1 ${
                  t.featured ? "bg-night text-white ring-1 ring-violet/40" : `${t.bg} ring-1 ring-edge`
                }`}
              >
                <span
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${
                    t.featured ? "bg-violet text-white" : "bg-violet/10 text-violet"
                  }`}
                >
                  <t.icon className="h-6 w-6" />
                </span>
                <h3 className={`mt-7 text-[15px] font-semibold ${t.featured ? "text-white/70" : "text-muted"}`}>{t.name}</h3>
                <p className={`mt-2 font-display text-[44px] font-bold tracking-tight ${t.featured ? "text-white" : "text-ink"}`}>
                  {t.price}
                </p>
                <p className={`mt-3 flex-1 text-[15px] leading-relaxed ${t.featured ? "text-white/60" : "text-muted"}`}>
                  {t.copy}
                </p>
                {t.featured && (
                  <span className="mt-6 inline-flex w-fit rounded-full bg-violet/20 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-violet-soft">
                    Most popular
                  </span>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            {...fadeUp}
            className="mt-12 flex flex-col items-center justify-between gap-8 rounded-[32px] bg-white p-10 shadow-card ring-1 ring-edge sm:flex-row"
          >
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-violet px-4 py-2 text-sm font-semibold text-white">
                <Sparkles className="h-4 w-4" />
                Free during beta
              </span>
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
                All analysis tools are currently free. Crypto pay-as-you-go (USDC) is coming soon.
              </p>
            </div>
            <a
              href="#analyze"
              className="group inline-flex shrink-0 items-center gap-2.5 rounded-full bg-ink px-8 py-4 text-base font-semibold text-white transition-all hover:bg-night hover:shadow-lift"
            >
              Analyze for Free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ==================== SECTION 8 — FAQ ==================== */}
      <section className="mx-auto max-w-shell px-5 py-32 sm:px-10">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.5fr] lg:gap-24">
          <motion.div {...fadeUp}>
            <Pill>FAQ</Pill>
            <h2 className="mt-8 font-display text-[44px] font-bold leading-[1.02] tracking-[-0.025em] text-ink sm:text-[64px]">
              Questions,
              <br />
              answered.
            </h2>
            <div className="art-ring float-slow mt-14 hidden h-32 w-32 border-[16px] lg:block" aria-hidden="true" />
          </motion.div>
          <motion.div {...fadeUp} className="divide-y divide-edge">
            {FAQS.map((f) => (
              <details key={f.q} className="group py-7">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  <span className="inline-flex items-start gap-4">
                    <HelpCircle className="mt-1 h-5 w-5 shrink-0 text-violet" />
                    {f.q}
                  </span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-edge text-xl font-light text-muted transition-all group-open:rotate-45 group-open:border-violet group-open:text-violet">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl pl-9 text-base leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== SECTION 9 — FINAL CTA ==================== */}
      <section className="cta-atmosphere noise relative">
        <div className="art-disc float-slower absolute left-[6%] top-[18%] hidden h-20 w-20 opacity-70 lg:block" aria-hidden="true" />
        <div className="art-ring float-slow absolute right-[8%] top-[22%] hidden h-24 w-24 border-[12px] opacity-70 lg:block" aria-hidden="true" />
        <div className="art-sphere-peach float-slow absolute bottom-[16%] right-[16%] hidden h-14 w-14 opacity-80 lg:block" aria-hidden="true" />
        <div className="mx-auto max-w-shell px-5 py-36 sm:px-10 sm:py-44">
          <motion.h2
            {...fadeUp}
            className="mx-auto max-w-3xl text-center font-display text-[48px] font-bold leading-[1.02] tracking-[-0.025em] text-white sm:text-[72px]"
          >
            Know what
            <br />
            <span className="bg-gradient-to-r from-violet-soft via-violet-lilac to-blush bg-clip-text text-transparent">
              the token represents.
            </span>
          </motion.h2>
          <motion.div {...fadeUp} className="mx-auto mt-14 max-w-[840px]">
            <AnalyzeBar dark hero compact />
            <p className="mt-5 text-center text-[13px] text-white/50">No account required · Free during beta</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

const FAQS = [
  {
    q: "What is TokenRWA?",
    a: "TokenRWA is an AI research tool for tokenized real-world assets. Paste a website, contract address or project name and it gathers available public information, structures it and generates a readable research report.",
  },
  {
    q: "What is an RWA Passport?",
    a: "The Passport is TokenRWA's structured report format: asset structure, token mechanics, yield, redemption, custody, legal signals, liquidity, multichain availability, categorized risks, red flags, due-diligence questions and a research score — with sources.",
  },
  {
    q: "Where does TokenRWA get its information?",
    a: "From sources you supply (like the project's website), public market endpoints such as DexScreener, and the AI model's general knowledge of well-known assets — always distinguishing verified information from inference, and marking unknowns as unknown.",
  },
  {
    q: "Does TokenRWA provide investment advice?",
    a: "No. TokenRWA is a research tool, not an investment adviser, broker, exchange, issuer, custodian or law firm. Scores describe research quality and identified risk signals, never expected returns.",
  },
  {
    q: "What does the RWA Score mean?",
    a: "A deterministic weighted score across transparency, asset backing, liquidity, redemption, custody, contract risk, counterparty risk and multichain access. Missing information lowers evidence and pulls scores toward uncertainty — it never inflates them.",
  },
  {
    q: "Do I need an account?",
    a: "No. There is no signup, login, wallet requirement or waitlist. Your recent research is stored locally in your browser.",
  },
  {
    q: "How will pricing work?",
    a: "Pay as you go — no subscriptions, no accounts. Crypto payments (USDC) are coming soon. Everything is free during the open beta.",
  },
  {
    q: "What chains are supported?",
    a: "The research system can categorize assets across Ethereum, Solana, Base, Arbitrum, Avalanche, Polygon, BNB Chain, Optimism and others. Chain coverage describes research capability, not integrations.",
  },
];
