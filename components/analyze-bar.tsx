"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";

const NETWORKS = ["Ethereum", "Solana", "Base", "Arbitrum", "Avalanche", "Polygon", "BNB Chain", "Optimism", "Other"];
const CHIPS = ["OUSG", "BUIDL", "USDY", "Tokenized Treasuries"];

export default function AnalyzeBar({
  dark = false,
  compact = false,
  hero = false,
}: {
  dark?: boolean;
  compact?: boolean;
  hero?: boolean;
}) {
  const router = useRouter();
  const uid = useId();
  const [query, setQuery] = useState("");
  const [advanced, setAdvanced] = useState(false);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [contract, setContract] = useState("");
  const [network, setNetwork] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (advanced) {
      if (name.trim()) params.set("name", name.trim());
      if (website.trim()) params.set("website", website.trim());
      if (contract.trim()) params.set("contract", contract.trim());
      if (network) params.set("network", network);
    }
    if (params.toString() === "") {
      setError("Paste a website, contract address, ticker or project name.");
      return;
    }
    setError(null);
    router.push(`/analyze?${params.toString()}`);
  }

  function runChip(chip: string) {
    router.push(`/analyze?q=${encodeURIComponent(chip)}`);
  }

  const shellCls = dark
    ? "border-white/[0.14] bg-[rgba(25,20,35,0.72)] shadow-[0_40px_120px_-40px_rgba(140,92,255,0.65)] backdrop-blur-[18px] focus-within:border-violet-soft/70 focus-within:bg-[rgba(30,24,42,0.8)]"
    : "border-edge bg-white shadow-lift focus-within:border-violet/40";
  const inputCls = dark ? "text-white placeholder:text-white/45" : "text-ink placeholder:text-muted/70";
  const advInputCls = dark
    ? "border-white/15 bg-white/[0.07] text-white placeholder:text-white/40"
    : "border-edge bg-white text-ink placeholder:text-muted/60";
  const labelCls = dark ? "text-white/60" : "text-muted";

  return (
    <div className="w-full">
      <form onSubmit={submit} className={`rounded-[28px] border transition-all ${shellCls} ${hero ? "p-2.5" : "p-2"}`}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label htmlFor={uid} className="sr-only">
            RWA website, contract or project name
          </label>
          {hero && (
            <span className="ml-4 hidden h-6 w-6 shrink-0 items-center justify-center text-violet-soft sm:flex" aria-hidden="true">
              <Sparkles className="h-5 w-5" />
            </span>
          )}
          <input
            id={uid}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Paste an RWA website, contract, ticker, or project…"
            className={`w-full flex-1 bg-transparent outline-none ${inputCls} ${
              hero ? "px-4 py-5 text-base sm:text-[17px]" : "px-4 py-3.5 text-[15px]"
            }`}
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="submit"
            className={`group inline-flex shrink-0 items-center justify-center gap-2.5 rounded-[20px] bg-violet font-semibold text-white transition-all hover:bg-[#7c49f5] hover:shadow-[0_16px_45px_-10px_rgba(140,92,255,0.85)] ${
              hero ? "px-8 py-5 text-[17px]" : "px-6 py-3.5 text-[15px]"
            }`}
          >
            Analyze Asset
            <ArrowRight className={`transition-transform group-hover:translate-x-1 ${hero ? "h-5 w-5" : "h-4 w-4"}`} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setAdvanced((v) => !v)}
          aria-expanded={advanced}
          className={`mt-1 inline-flex items-center gap-1 px-4 pb-2 text-xs font-medium ${labelCls} hover:opacity-80`}
        >
          Advanced inputs
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${advanced ? "rotate-180" : ""}`} />
        </button>

        {advanced && (
          <div className="grid grid-cols-1 gap-2 px-2 pb-2 sm:grid-cols-2">
            <input
              aria-label="Project or asset name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project / asset name"
              className={`rounded-xl border px-3.5 py-3 text-sm outline-none ${advInputCls}`}
            />
            <input
              aria-label="Website URL"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="Website URL"
              className={`rounded-xl border px-3.5 py-3 text-sm outline-none ${advInputCls}`}
            />
            <input
              aria-label="Contract address"
              value={contract}
              onChange={(e) => setContract(e.target.value)}
              placeholder="Contract address (0x…)"
              className={`rounded-xl border px-3.5 py-3 text-sm outline-none ${advInputCls}`}
            />
            <select
              aria-label="Network"
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className={`rounded-xl border px-3 py-3 text-sm outline-none ${advInputCls} ${network ? "" : dark ? "text-white/40" : "text-muted/60"}`}
            >
              <option value="">Network (optional)</option>
              {NETWORKS.map((n) => (
                <option key={n} value={n} className="text-ink">
                  {n}
                </option>
              ))}
            </select>
          </div>
        )}
      </form>

      {error && (
        <p role="alert" className={`mt-2 px-2 text-sm ${dark ? "text-blush" : "text-violet"}`}>
          {error}
        </p>
      )}

      {!compact && (
        <div className={`mt-5 flex flex-wrap items-center gap-2.5 px-1 ${hero ? "justify-center" : ""}`}>
          <span className={`text-[13px] ${labelCls}`}>Try:</span>
          {CHIPS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => runChip(c)}
              className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-all ${
                dark
                  ? "border-white/15 bg-white/[0.04] text-white/75 hover:border-violet-soft/60 hover:bg-white/[0.09] hover:text-white"
                  : "border-edge bg-white text-muted hover:border-violet/40 hover:text-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
