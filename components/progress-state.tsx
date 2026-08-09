"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { LogoMark } from "@/components/logo";

const STAGES = [
  "Discovering asset",
  "Reading sources",
  "Mapping structure",
  "Reviewing redemption",
  "Checking liquidity",
  "Evaluating risks",
  "Building RWA Passport",
];

const FRAGMENTS = [
  { label: "Issuer", cls: "left-[6%] top-[16%] -rotate-6", delay: 1.2 },
  { label: "Backing", cls: "right-[8%] top-[10%] rotate-3", delay: 2.6 },
  { label: "Custody", cls: "left-[2%] top-[58%] rotate-2", delay: 4.2 },
  { label: "Yield", cls: "right-[4%] top-[46%] -rotate-3", delay: 5.6 },
  { label: "Liquidity", cls: "left-[14%] top-[84%] rotate-3", delay: 7.2 },
  { label: "Redemption", cls: "right-[10%] top-[78%] -rotate-2", delay: 8.6 },
];

export default function ProgressState({ label }: { label: string }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 3800);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-6 py-16"
      role="status"
      aria-live="polite"
    >
      <div className="relative h-[340px] w-full max-w-lg">
        {/* research fragments appearing around the object */}
        {FRAGMENTS.map((f) => (
          <motion.span
            key={f.label}
            initial={{ opacity: 0, y: 14, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: f.delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute flex items-center gap-2 rounded-2xl border border-edge bg-white px-4 py-2.5 shadow-card ${f.cls}`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-violet" />
            <span className="text-[13px] font-medium text-ink/80">{f.label}</span>
          </motion.span>
        ))}

        {/* central animated object */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative flex h-36 w-36 items-center justify-center">
            <motion.div
              className="absolute inset-0 rounded-full bg-violet/10"
              animate={{ scale: [1, 1.25, 1], opacity: [0.7, 0.2, 0.7] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-4 rounded-full border border-violet/30"
              animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
            <motion.div
              className="absolute inset-9 rounded-full bg-gradient-to-br from-violet-faint to-violet-lilac/50"
              animate={{ rotate: 360 }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative text-violet"
            >
              <LogoMark className="h-14 w-14" />
            </motion.div>
          </div>
        </div>
      </div>

      <h1 className="mt-10 text-center font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Researching {label}
      </h1>

      <div className="mt-5 h-7">
        <AnimatePresence mode="wait">
          <motion.p
            key={stage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 text-base text-muted"
          >
            <Loader2 className="h-4 w-4 animate-spin text-violet" />
            {STAGES[stage]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="mt-8 h-1.5 w-72 overflow-hidden rounded-full bg-violet-faint">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-violet to-violet-soft"
          initial={{ width: "5%" }}
          animate={{ width: `${Math.min(8 + (stage + 1) * 12.5, 94)}%` }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
      </div>
      <p className="mt-7 max-w-sm text-center text-[13px] leading-relaxed text-muted/80">
        TokenRWA is gathering public information, structuring it and running AI analysis. This usually takes under a
        minute.
      </p>
    </div>
  );
}
