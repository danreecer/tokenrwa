"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PenLine, RotateCw } from "lucide-react";
import type { TReport } from "@/lib/schemas/passport";
import { listRecent, saveRecent } from "@/lib/utils/recent";
import AnalyzeBar from "@/components/analyze-bar";
import Passport from "@/components/report/passport";
import ProgressState from "@/components/progress-state";

type State =
  | { kind: "idle" }
  | { kind: "loading"; label: string }
  | { kind: "done"; report: TReport }
  | { kind: "error"; message: string };

export default function AnalyzeClient() {
  const params = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<State>({ kind: "idle" });
  const requested = useRef<string | null>(null);

  const q = params.get("q") ?? "";
  const name = params.get("name") ?? "";
  const website = params.get("website") ?? "";
  const contract = params.get("contract") ?? "";
  const network = params.get("network") ?? "";
  const recentId = params.get("recent") ?? "";
  const label = q || name || website || contract;
  const key = params.toString();

  const run = useCallback(async () => {
    if (recentId) {
      const entry = listRecent().find((e) => e.id === recentId);
      if (entry) {
        setState({ kind: "done", report: entry.report });
        return;
      }
      setState({ kind: "error", message: "That saved analysis is no longer in your local history." });
      return;
    }
    if (!label) {
      setState({ kind: "idle" });
      return;
    }
    setState({ kind: "loading", label });
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          query: q || undefined,
          name: name || undefined,
          website: website || undefined,
          contract: contract || undefined,
          network: network || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setState({
          kind: "error",
          message:
            data.message ??
            "We couldn't find enough reliable information to build a complete Passport. Try adding the project's official website or contract address.",
        });
        return;
      }
      const report: TReport = data.report;
      saveRecent(report);
      setState({ kind: "done", report });
      window.scrollTo({ top: 0 });
    } catch {
      setState({ kind: "error", message: "The request timed out or the network dropped. Please try again." });
    }
  }, [recentId, label, q, name, website, contract, network]);

  useEffect(() => {
    if (requested.current === key) return;
    requested.current = key;
    run();
  }, [key, run]);

  return (
    <div className="min-h-screen bg-white">
      {/* Slim dark band keeps the nav legible and the brand continuous */}
      <div className="hero-atmosphere h-40" aria-hidden="true" />
      <div className="-mt-16">
        {state.kind === "idle" && (
          <div className="mx-auto max-w-2xl px-5 pb-24 pt-20 text-center sm:px-8">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">Analyze an RWA</h1>
            <p className="mt-3 text-sm text-muted">Paste a website, contract address, ticker or project name.</p>
            <div className="mt-8 text-left">
              <AnalyzeBar />
            </div>
          </div>
        )}

        {state.kind === "loading" && <ProgressState label={state.label} />}

        {state.kind === "done" && <Passport report={state.report} />}

        {state.kind === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-xl px-5 pb-24 pt-20 text-center sm:px-8"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-faint text-violet">
              <PenLine className="h-6 w-6" />
            </div>
            <h1 className="mt-6 font-display text-2xl font-bold tracking-tight text-ink">
              We couldn&apos;t complete that research
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">{state.message}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  requested.current = null;
                  run();
                }}
                className="inline-flex items-center gap-2 rounded-full bg-violet px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet/90"
              >
                <RotateCw className="h-4 w-4" />
                Try again
              </button>
              <button
                type="button"
                onClick={() => router.push("/analyze")}
                className="inline-flex items-center gap-2 rounded-full border border-edge px-5 py-2.5 text-sm font-medium text-ink hover:border-violet/40"
              >
                Edit inputs
              </button>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 rounded-full border border-edge px-5 py-2.5 text-sm font-medium text-ink hover:border-violet/40"
              >
                Browse examples
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
