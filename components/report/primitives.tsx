"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { TRiskLevel, TSourcedString } from "@/lib/schemas/passport";

export function Section({
  number,
  title,
  icon,
  id,
  children,
}: {
  number: string;
  title: string;
  icon?: React.ReactNode;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="print-block scroll-mt-28 rounded-[28px] border border-edge bg-white p-7 shadow-card sm:p-10"
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet/10 text-violet">
            {icon}
          </span>
        )}
        <div className="flex items-baseline gap-3">
          <span className="font-display text-sm font-bold text-violet">{number}</span>
          <h2 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">{title}</h2>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </motion.section>
  );
}

export function FieldRow({ label, field }: { label: string; field: TSourcedString }) {
  const missing = field.value == null;
  return (
    <div className="flex flex-col gap-1 border-b border-edge py-3 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-6">
      <dt className="w-48 shrink-0 text-[13px] font-medium uppercase tracking-wide text-muted">{label}</dt>
      <dd className={`flex-1 text-base leading-relaxed ${missing ? "italic text-muted/70" : "text-ink"}`}>
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

export function FieldList({ children }: { children: React.ReactNode }) {
  return <dl>{children}</dl>;
}

const RISK_STYLES: Record<TRiskLevel, string> = {
  LOW: "bg-emerald-50 text-emerald-700 border-emerald-200",
  MODERATE: "bg-amber-50 text-amber-700 border-amber-200",
  ELEVATED: "bg-rose-50 text-rose-700 border-rose-200",
  UNKNOWN: "bg-body text-muted border-edge",
};

export function RiskBadge({ level }: { level: TRiskLevel }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${RISK_STYLES[level]}`}>
      {level}
    </span>
  );
}

export function ChainPill({ chain, interop }: { chain: string; interop?: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-edge bg-body px-3.5 py-1.5 text-sm font-medium text-ink">
      {chain}
      {interop && (
        <span
          className={`text-[10px] font-semibold uppercase tracking-wider ${
            interop === "Native" ? "text-violet" : interop === "Bridged" ? "text-amber-600" : "text-muted"
          }`}
        >
          {interop}
        </span>
      )}
    </span>
  );
}

export function CategoryBar({ label, score, note }: { label: string; score: number; note?: string | null }) {
  return (
    <div title={note ?? undefined}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[13px] font-medium text-ink">{label}</span>
        <span className="font-display text-sm font-bold text-ink">{score}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-violet-faint">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-violet to-violet-soft"
          initial={{ width: 0 }}
          whileInView={{ width: `${score}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        />
      </div>
    </div>
  );
}
