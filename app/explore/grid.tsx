"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Search, Sparkles } from "lucide-react";
import { EXPLORE_ASSETS, EXPLORE_CATEGORIES, type ExploreAsset } from "@/lib/demo/assets";
import { monogram } from "@/lib/utils/format";
import { LogoMark } from "@/components/logo";
import AnalyzeBar from "@/components/analyze-bar";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

/** Subtle per-category identity: monogram + accent treatments. */
const CATEGORY_STYLE: Record<string, { mono: string; accent: string; dot: string }> = {
  "Tokenized Treasuries": { mono: "from-violet to-violet-soft", accent: "bg-violet-faint text-violet", dot: "bg-violet" },
  Stablecoins: { mono: "from-sky-400 to-teal-300", accent: "bg-sky-50 text-sky-700", dot: "bg-sky-400" },
  "Private Credit": { mono: "from-[#F2A98C] to-[#F0B4DE]", accent: "bg-orange-50 text-orange-700", dot: "bg-[#F2A98C]" },
  "Tokenized Funds": { mono: "from-[#F0B4DE] to-violet-soft", accent: "bg-pink-50 text-pink-700", dot: "bg-[#F0B4DE]" },
  Commodities: { mono: "from-amber-300 to-[#F2C98C]", accent: "bg-amber-50 text-amber-700", dot: "bg-amber-400" },
  "Real Estate": { mono: "from-[#D8907C] to-violet-lilac", accent: "bg-rose-50 text-rose-700", dot: "bg-[#D8907C]" },
  "Tokenized Equities": { mono: "from-indigo-400 to-violet-soft", accent: "bg-indigo-50 text-indigo-700", dot: "bg-indigo-400" },
};

const FEATURED_IDS = ["ousg", "buidl", "usdy"];

function styleFor(cat: string) {
  return CATEGORY_STYLE[cat] ?? CATEGORY_STYLE["Tokenized Treasuries"];
}

function matches(a: ExploreAsset, q: string): boolean {
  const s = q.toLowerCase();
  return (
    a.name.toLowerCase().includes(s) ||
    a.ticker.toLowerCase().includes(s) ||
    a.category.toLowerCase().includes(s) ||
    a.description.toLowerCase().includes(s) ||
    a.networks.some((n) => n.toLowerCase().includes(s))
  );
}

/* Abstract RWA map for the hero right side. */
function ExploreMap() {
  const nodes = [
    { label: "Treasuries", cls: "left-[6%] top-[12%]", shape: "art-sphere h-6 w-6" },
    { label: "Stablecoins", cls: "right-[4%] top-[6%]", shape: "art-disc h-7 w-7" },
    { label: "Private Credit", cls: "left-[0%] top-[58%]", shape: "art-sphere-peach h-6 w-6" },
    { label: "Funds", cls: "right-[0%] top-[42%]", shape: "art-sphere h-5 w-5" },
    { label: "Commodities", cls: "left-[22%] top-[86%]", shape: "art-sphere-peach h-5 w-5" },
    { label: "Real Estate", cls: "right-[14%] top-[78%]", shape: "art-disc h-6 w-6" },
    { label: "Equities", cls: "left-[30%] top-[2%]", shape: "art-sphere h-5 w-5" },
  ];
  return (
    <div className="relative h-[340px] w-full max-w-md select-none" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 340" fill="none">
        {[
          "M200 170 L60 55", "M200 170 L340 40", "M200 170 L28 210", "M200 170 L372 155",
          "M200 170 L120 300", "M200 170 L310 275", "M200 170 L145 25",
        ].map((d) => (
          <path key={d} d={d} stroke="rgba(184,152,255,0.28)" strokeWidth="1" strokeDasharray="3 5" />
        ))}
      </svg>
      <div className="absolute left-1/2 top-1/2 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-0.5 rounded-full border border-white/10 bg-white/[0.06] shadow-[0_20px_60px_-15px_rgba(140,92,255,0.6)] backdrop-blur-md">
        <LogoMark className="h-6 w-6 text-violet-soft" />
        <span className="text-[9px] font-bold uppercase tracking-wider text-white/70">TokenRWA</span>
      </div>
      {nodes.map((n) => (
        <div key={n.label} className={`absolute flex items-center gap-2 ${n.cls}`}>
          <span className={`${n.shape} float-slow shrink-0`} />
          <span className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] font-medium text-white/70 backdrop-blur-sm">
            {n.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function AssetCard({ a, large = false }: { a: ExploreAsset; large?: boolean }) {
  const st = styleFor(a.category);
  return (
    <motion.div
      {...fadeUp}
      className={`group relative flex flex-col rounded-[26px] transition-all hover:-translate-y-1 hover:shadow-lift ${
        large
          ? "bg-gradient-to-b from-violet-faint via-white to-white p-9 shadow-card ring-1 ring-violet/15"
          : "bg-white p-7 shadow-card ring-1 ring-edge hover:ring-violet/30"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br font-display font-bold text-white ${st.mono} ${
            large ? "h-16 w-16 text-xl" : "h-[52px] w-[52px] text-base"
          }`}
        >
          {monogram(a.ticker)}
        </div>
        <span className={`rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider ${st.accent}`}>
          {a.category}
        </span>
      </div>
      <h3 className={`mt-5 font-display font-bold leading-snug tracking-tight text-ink ${large ? "text-2xl" : "text-lg"}`}>
        {a.name}
      </h3>
      <p className="mt-1 text-sm font-semibold text-violet">{a.ticker}</p>
      <p className={`mt-2.5 flex-1 leading-relaxed text-muted ${large ? "text-base" : "text-[15px]"}`}>{a.description}</p>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {a.networks.slice(0, 4).map((n) => (
          <span key={n} className="inline-flex items-center gap-1.5 rounded-full bg-body px-3 py-1.5 text-xs font-medium text-ink/70">
            <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
            {n}
          </span>
        ))}
        {a.networks.length > 4 && (
          <span className="rounded-full bg-body px-3 py-1.5 text-xs font-medium text-ink/70">+{a.networks.length - 4}</span>
        )}
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-edge pt-5">
        <span className="text-xs text-muted/80">
          Curated metadata
          <br />
          Not live research
        </span>
        <Link
          href={`/analyze?q=${encodeURIComponent(a.ticker)}`}
          className={`inline-flex items-center gap-2 rounded-full font-semibold transition-all group-hover:gap-3 ${
            large
              ? "bg-violet px-6 py-3 text-[15px] text-white hover:bg-[#7c49f5]"
              : "border border-edge px-[18px] py-2.5 text-sm text-ink group-hover:border-violet group-hover:text-violet"
          }`}
          aria-label={`Analyze ${a.name}`}
        >
          Analyze{large ? " Asset" : ""}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}

export default function ExploreClient() {
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");
  const cats = ["All", ...EXPLORE_CATEGORIES];

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: EXPLORE_ASSETS.length };
    for (const cat of EXPLORE_CATEGORIES) c[cat] = EXPLORE_ASSETS.filter((a) => a.category === cat).length;
    return c;
  }, []);

  const filtered = useMemo(() => {
    let list = category === "All" ? EXPLORE_ASSETS : EXPLORE_ASSETS.filter((a) => a.category === category);
    if (query.trim()) list = list.filter((a) => matches(a, query.trim()));
    return list;
  }, [category, query]);

  const searching = query.trim().length > 0 || category !== "All";
  const featured = EXPLORE_ASSETS.filter((a) => FEATURED_IDS.includes(a.id));
  const rest = searching ? filtered : EXPLORE_ASSETS.filter((a) => !FEATURED_IDS.includes(a.id));

  return (
    <div className="overflow-x-clip bg-white">
      {/* ---------------- Hero ---------------- */}
      <header className="hero-atmosphere noise relative">
        <div className="relative mx-auto max-w-shell px-5 pb-24 pt-36 sm:px-10 sm:pt-40">
          <div className="grid items-center gap-14 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-lilac">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-soft" />
                Explore
              </p>
              <h1 className="mt-7 font-display text-[48px] font-bold leading-[1.0] tracking-[-0.025em] text-white sm:text-[68px]">
                A starting map of
                <br />
                <span className="bg-gradient-to-r from-violet-soft via-violet-lilac to-blush bg-clip-text text-transparent">
                  tokenized assets.
                </span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/70">
                Curated catalog metadata for recognizable RWA categories. Pick one and TokenRWA runs the standard
                analysis flow — catalog descriptions are not live research.
              </p>
            </div>
            <div className="hidden justify-end lg:flex">
              <ExploreMap />
            </div>
          </div>
        </div>
        {/* atmospheric fade into the discovery area */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent via-[#FAF9FC]/40 to-[#FAF9FC]" aria-hidden="true" />
      </header>

      {/* ---------------- Discovery: search + filters ---------------- */}
      <div className="bg-[#FAF9FC]">
        <div className="mx-auto max-w-shell px-5 py-12 sm:px-10">
          <div className="mx-auto max-w-2xl">
            <label htmlFor="explore-search" className="sr-only">
              Search assets
            </label>
            <div className="flex items-center gap-3 rounded-[22px] border border-edge bg-white px-5 shadow-card focus-within:border-violet/40">
              <Search className="h-5 w-5 shrink-0 text-muted" />
              <input
                id="explore-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search assets, tickers, issuers or categories…"
                className="w-full bg-transparent py-4 text-base text-ink outline-none placeholder:text-muted/60"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </div>

          <div
            className="scroll-thin mt-7 flex gap-2.5 overflow-x-auto pb-2 lg:flex-wrap lg:justify-center"
            role="tablist"
            aria-label="Asset categories"
          >
            {cats.map((c) => (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={category === c}
                onClick={() => setCategory(c)}
                className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-5 text-sm font-semibold transition-all ${
                  category === c
                    ? "border-violet bg-violet text-white shadow-[0_10px_30px_-10px_rgba(140,92,255,0.7)]"
                    : "border-edge bg-white text-muted hover:border-violet/40 hover:text-ink"
                }`}
              >
                {c}
                <span className={`text-xs font-medium ${category === c ? "text-white/70" : "text-muted/60"}`}>
                  {counts[c] ?? 0}
                </span>
              </button>
            ))}
          </div>

          {/* research pipeline reminder */}
          <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center gap-3 text-center">
            <p className="inline-flex items-center gap-2 text-[15px] font-medium text-ink/80">
              <Sparkles className="h-4 w-4 text-violet" />
              Choose any asset. TokenRWA researches it with the same AI analysis pipeline.
            </p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs font-medium uppercase tracking-wider text-muted/60">
              {["Website", "Token", "Backing", "Yield", "Liquidity", "Redemption", "Custody", "Risk"].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Body ---------------- */}
      <div className="mx-auto max-w-shell px-5 pb-28 pt-14 sm:px-10">
        {/* Featured research (hidden while searching/filtering) */}
        {!searching && (
          <>
            <motion.h2 {...fadeUp} className="font-display text-[32px] font-bold tracking-tight text-ink sm:text-[40px]">
              Featured research
            </motion.h2>
            <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
              {featured[0] && <AssetCard a={featured[0]} large />}
              <div className="grid gap-6">
                {featured.slice(1).map((a) => (
                  <AssetCard key={a.id} a={a} />
                ))}
              </div>
            </div>
            <motion.h2
              {...fadeUp}
              className="mt-20 font-display text-[32px] font-bold tracking-tight text-ink sm:text-[40px]"
            >
              The catalog
            </motion.h2>
          </>
        )}

        {/* Grid */}
        {rest.length > 0 ? (
          <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${searching ? "" : "mt-8"}`}>
            {rest.map((a) => (
              <AssetCard key={a.id} a={a} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-4 max-w-xl rounded-[28px] bg-gradient-to-b from-violet-faint to-white p-10 text-center shadow-card ring-1 ring-violet/15"
          >
            <h3 className="font-display text-2xl font-bold tracking-tight text-ink">No catalog match.</h3>
            <p className="mt-2 text-base text-muted">TokenRWA can still research it.</p>
            <p className="mt-5 inline-flex rounded-full bg-white px-5 py-2.5 font-mono text-sm text-ink shadow-sm ring-1 ring-edge">
              {query.trim()}
            </p>
            <div className="mt-7">
              <Link
                href={`/analyze?q=${encodeURIComponent(query.trim())}`}
                className="inline-flex items-center gap-2 rounded-full bg-violet px-7 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-[#7c49f5]"
              >
                Analyze this asset
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Mid-page research CTA */}
        <motion.div
          {...fadeUp}
          className="mt-20 rounded-[32px] bg-[#F7F4FC] p-10 ring-1 ring-violet/10 sm:p-14"
        >
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-[32px] font-bold leading-tight tracking-tight text-ink sm:text-[40px]">
              Don&apos;t see the asset you&apos;re looking for?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted">
              TokenRWA can analyze projects beyond the curated catalog.
            </p>
            <div className="mx-auto mt-9 max-w-2xl text-left">
              <AnalyzeBar compact />
            </div>
            <p className="mt-5 inline-flex items-center gap-1.5 text-[13px] text-muted/80">
              <ArrowUpRight className="h-3.5 w-3.5 text-violet" />
              Paste a website, contract, ticker or project — no account required.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
