"use client";

import { useState } from "react";
import { Check, Copy, Download, Printer } from "lucide-react";
import type { TReport } from "@/lib/schemas/passport";
import { buildMarkdown } from "@/lib/utils/export";

export default function ExportButtons({ report }: { report: TReport }) {
  const [copied, setCopied] = useState<"summary" | "research" | null>(null);

  async function copy(kind: "summary" | "research") {
    const text =
      kind === "summary"
        ? `${report.passport.identity.name} — RWA Score ${report.scores.overall}/100 (${report.scores.label})\n\n${report.passport.summary}\n\nvia TokenRWA (tokenrwa.net) — research, not investment advice.`
        : buildMarkdown(report);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1800);
    } catch {}
  }

  function downloadJson() {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(report.passport.identity.ticker ?? report.passport.identity.name).toLowerCase().replace(/[^a-z0-9]+/g, "-")}-rwa-passport.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const btn =
    "inline-flex items-center gap-1.5 rounded-full border border-edge bg-white px-3.5 py-2 text-xs font-medium text-ink transition-colors hover:border-violet/40 hover:text-violet";

  return (
    <div className="no-print flex flex-wrap gap-2">
      <button type="button" onClick={() => copy("summary")} className={btn}>
        {copied === "summary" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
        Copy summary
      </button>
      <button type="button" onClick={() => copy("research")} className={btn}>
        {copied === "research" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
        Copy Markdown
      </button>
      <button type="button" onClick={downloadJson} className={btn}>
        <Download className="h-3.5 w-3.5" />
        Download JSON
      </button>
      <button type="button" onClick={() => window.print()} className={btn}>
        <Printer className="h-3.5 w-3.5" />
        Print / PDF
      </button>
    </div>
  );
}
