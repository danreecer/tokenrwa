"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  ArrowRight,
  Droplets,
  Eye,
  Gauge,
  Landmark,
  Loader2,
  Network,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  UserCheck,
  Vault,
} from "lucide-react";
import type { TReport, TSourcedString } from "@/lib/schemas/passport";
import { monogram } from "@/lib/utils/format";

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "done"; reports: TReport[]; commentary: string; commentaryDemo: boolean; failures: string[] }
  | { kind: "error"; message: string };

const sv = (s: TSourcedString, max = 110): string => {
  if (!s.value) return "Not verified";
  return s.value.length > max ? `${s.value.slice(0, max)}…` : s.value;
};

export default function CompareClient() {
  const [inputs, setInputs] = useState(["", "", ""]);
  const [state, setState] = useState<State>({ kind: "idle" });

  async function run(e?: React.FormEvent) {
    e?.preventDefault();
    const queries = inputs.map((i) => i.trim()).filter(Boolean);
    if (queries.length < 2) {
      setState({ kind: "error", message: "Enter at least two assets to compare." });
      return;
    }
    setState({ kind: "loading" });
    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ queries }),
      });
      const data = await res.json();
      if (!res.ok) {
        setState({ kind: "error", message: data.message ?? "Comparison failed. Please try again." });
        return;
      }
      setState({
        kind: "done",
        reports: data.reports,
        commentary: data.commentary,
        commentaryDemo: data.commentaryDemo,
        failures: data.failures ?? [],
      });
    } catch {
      setState({ kind: "error", message: "The request timed out or the network dropped. Please try again." });
    }
  }

  return (
    <div className="mx-auto max-w-shell px-5 pb-28 pt-12 sm:px-8">
      <form onSubmit={run} className="mx-auto max-w-3xl">
        <div className="grid gap-3 sm:grid-cols-3">
          {inputs.map((v, i) => (
            <div key={i}>
              <label htmlFor={`cmp-${i}`} className="sr-only">
                Asset {i + 1}
              </label>
              <input
                id={`cmp-${i}`}
                value={v}
                onChange={(e) => setInputs((prev) => prev.map((p, j) => (j === i ? e.target.value : p)))}
                placeholder={["OUSG", "BUIDL", "USDY (optional)"][i]}
                className="w-full rounded-2xl border border-edge bg-white px-4 py-3.5 text-[15px] text-ink outline-none placeholder:text-muted/60 focus:border-violet/40"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <button
            type="submit"
            disabled={state.kind === "loading"}
            className="group inline-flex items-center gap-2 rounded-full bg-violet px-7 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-violet/90 disabled:opacity-60"
          >
            {state.kind === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Researching assets…
              </>
            ) : (
              <>
                Compare Assets
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>
        {state.kind === "loading" && (
          <p className="mt-4 text-center text-xs text-muted" role="status">
            Running research on each asset — this can take a minute or two.
          </p>
        )}
        {state.kind === "error" && (
          <p role="alert" className="mt-4 text-center text-sm text-violet">
            {state.message}
          </p>
        )}
      </form>

      {state.kind === "done" && (
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-14">
          {state.failures.length > 0 && (
            <p className="mb-4 text-center text-xs text-muted">
              Couldn&apos;t research: {state.failures.join(", ")}
            </p>
          )}
          <div className="scroll-thin overflow-x-auto rounded-3xl border border-edge">
            <table className="w-full min-w-[720px] border-collapse bg-white text-left text-sm">
              <thead>
                <tr className="border-b border-edge">
                  <th scope="col" className="w-44 px-5 py-4 text-[11px] font-semibold uppercase tracking-widest text-muted">
                    Asset
                  </th>
                  {state.reports.map((r) => (
                    <th key={r.id} scope="col" className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet to-violet-soft text-xs font-bold text-white">
                          {monogram(r.passport.identity.ticker ?? r.passport.identity.name)}
                        </span>
                        <div>
                          <p className="font-display text-sm font-bold text-ink">
                            {r.passport.identity.ticker ?? r.passport.identity.name}
                          </p>
                          {r.demo && <p className="text-[10px] font-semibold uppercase text-amber-600">Demo</p>}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="align-top">
                <Row icon={Landmark} label="Underlying Exposure" cells={state.reports.map((r) => sv(r.passport.asset.underlyingAsset))} />
                <Row icon={Network} label="Network" cells={state.reports.map((r) => r.passport.multichain.chains.map((c) => c.chain).join(", ") || "Not verified")} />
                <Row icon={TrendingUp} label="Yield" cells={state.reports.map((r) => sv(r.passport.yield.source))} />
                <Row icon={Droplets} label="Liquidity" cells={state.reports.map((r) => sv(r.passport.liquidity.markets))} />
                <Row icon={ArrowLeftRight} label="Redemption" cells={state.reports.map((r) => sv(r.passport.redemption.available))} />
                <Row icon={Vault} label="Custody" cells={state.reports.map((r) => sv(r.passport.custody.assetCustodian))} />
                <Row icon={UserCheck} label="Eligibility" cells={state.reports.map((r) => sv(r.passport.legal.eligibility))} />
                <Row
                  icon={Eye}
                  label="Transparency"
                  cells={state.reports.map((r) => `${r.scores.categories.find((c) => c.key === "transparency")?.score ?? "—"}/100`)}
                />
                <Row
                  icon={ShieldAlert}
                  label="Risk"
                  cells={state.reports.map((r) => {
                    const elevated = r.passport.risks.filter((x) => x.level === "ELEVATED").length;
                    const moderate = r.passport.risks.filter((x) => x.level === "MODERATE").length;
                    return elevated > 0 ? `${elevated} elevated, ${moderate} moderate` : `${moderate} moderate`;
                  })}
                />
                <tr className="border-t border-edge bg-violet-faint/40">
                  <th scope="row" className="px-5 py-4 text-[11px] font-semibold uppercase tracking-widest text-muted">
                    <span className="inline-flex items-center gap-2">
                      <Gauge className="h-3.5 w-3.5 text-violet" />
                      RWA Score
                    </span>
                  </th>
                  {state.reports.map((r) => (
                    <td key={r.id} className="px-5 py-4">
                      <span className="font-display text-2xl font-extrabold text-ink">{r.scores.overall}</span>
                      <span className="ml-1 text-xs text-muted">/ 100 · {r.scores.label}</span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 rounded-3xl border border-edge bg-gradient-to-b from-violet-faint/60 to-white p-6 sm:p-8">
            <div className="flex items-center gap-2 text-violet">
              <Sparkles className="h-4 w-4" />
              <h2 className="text-xs font-semibold uppercase tracking-widest">AI Comparison</h2>
              {state.commentaryDemo && (
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-700">
                  Generated without live AI
                </span>
              )}
            </div>
            <p className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-ink">{state.commentary}</p>
            <p className="mt-4 text-[11px] text-muted/80">
              Factual comparison of research signals — not a recommendation of what to buy.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {state.reports.map((r) => (
              <Link
                key={r.id}
                href={`/analyze?q=${encodeURIComponent(r.passport.identity.ticker ?? r.passport.identity.name)}`}
                className="rounded-full border border-edge px-4 py-2 text-sm font-medium text-ink hover:border-violet/40"
              >
                Full Passport: {r.passport.identity.ticker ?? r.passport.identity.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  cells,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  cells: string[];
}) {
  return (
    <tr className="border-t border-edge">
      <th scope="row" className="px-5 py-4 text-[11px] font-semibold uppercase tracking-widest text-muted">
        <span className="inline-flex items-center gap-2">
          {Icon && <Icon className="h-3.5 w-3.5 text-violet" />}
          {label}
        </span>
      </th>
      {cells.map((c, i) => (
        <td key={i} className={`px-5 py-4 leading-relaxed ${c === "Not verified" ? "italic text-muted/70" : "text-ink"}`}>
          {c}
        </td>
      ))}
    </tr>
  );
}
