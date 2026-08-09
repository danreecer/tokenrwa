"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, History, Trash2, X } from "lucide-react";
import { clearRecent, deleteRecent, listRecent, type RecentEntry } from "@/lib/utils/recent";
import { monogram, timeAgo } from "@/lib/utils/format";

export default function RecentResearch() {
  const [entries, setEntries] = useState<RecentEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setEntries(listRecent());
    setMounted(true);
  }, []);

  if (!mounted || entries.length === 0) return null;

  return (
    <section aria-label="Recent research" className="mx-auto max-w-shell px-5 pt-14 sm:px-10">
      <div className="flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2.5 font-display text-xl font-bold tracking-tight text-ink">
          <History className="h-5 w-5 text-violet" />
          Recent Research
        </h2>
        <button
          type="button"
          onClick={() => {
            clearRecent();
            setEntries([]);
          }}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-ink"
        >
          <Trash2 className="h-4 w-4" />
          Clear history
        </button>
      </div>

      <div className={`mt-5 grid gap-4 ${entries.length > 1 ? "lg:grid-cols-2" : ""}`}>
        {entries.slice(0, 4).map((e) => (
          <div
            key={e.id}
            className="group relative flex items-center gap-5 rounded-[24px] border border-edge bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-violet/30"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet to-violet-soft font-display text-base font-bold text-white">
              {monogram(e.ticker ?? e.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-semibold text-ink">{e.name}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[13px] text-muted">
                {e.ticker && <span className="font-semibold text-violet">{e.ticker}</span>}
                <span>{timeAgo(e.createdAt)}</span>
                {e.demo && (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                    Demo
                  </span>
                )}
              </div>
            </div>
            <div className="hidden shrink-0 text-right sm:block">
              <p className="font-display text-2xl font-bold text-ink">{e.score}</p>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">RWA Score</p>
            </div>
            <Link
              href={`/analyze?recent=${e.id}`}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-edge px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-violet hover:text-violet"
              aria-label={`Reopen ${e.name}`}
            >
              Reopen
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              aria-label={`Delete ${e.name} from history`}
              onClick={() => {
                deleteRecent(e.id);
                setEntries(listRecent());
              }}
              className="absolute -right-2 -top-2 hidden h-7 w-7 items-center justify-center rounded-full border border-edge bg-white text-muted shadow-sm hover:text-ink group-hover:flex"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
