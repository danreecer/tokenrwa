"use client";

import type { TReport } from "@/lib/schemas/passport";

const KEY = "tokenrwa.recent.v1";
const MAX = 12;

export type RecentEntry = {
  id: string;
  createdAt: number;
  demo: boolean;
  name: string;
  ticker: string | null;
  score: number;
  report: TReport;
};

function read(): RecentEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as RecentEntry[]) : [];
  } catch {
    return [];
  }
}

function write(entries: RecentEntry[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(entries.slice(0, MAX)));
  } catch {
    // Storage full or unavailable — recent history is best-effort.
  }
}

export function listRecent(): RecentEntry[] {
  return read();
}

export function saveRecent(report: TReport) {
  const entry: RecentEntry = {
    id: report.id,
    createdAt: report.createdAt,
    demo: report.demo,
    name: report.passport.identity.name,
    ticker: report.passport.identity.ticker,
    score: report.scores.overall,
    report,
  };
  const rest = read().filter((e) => e.id !== report.id && e.name !== entry.name);
  write([entry, ...rest]);
}

export function deleteRecent(id: string) {
  write(read().filter((e) => e.id !== id));
}

export function clearRecent() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {}
}
