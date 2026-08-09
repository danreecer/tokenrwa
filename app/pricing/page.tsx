import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, GitCompareArrows, Microscope, Sparkles, Zap } from "lucide-react";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Pay as you go. No subscriptions, no accounts. Free during the open beta — crypto payments coming soon.",
};

const TIERS = [
  { name: "Quick Scan", price: "$0.50", copy: "A fast structural read of a single asset — what it is, who issues it, headline risks.", icon: Zap },
  { name: "Full RWA Passport", price: "$2.00", copy: "The complete structured research report with scores, risks, red flags, questions and sources.", featured: true, icon: FileText },
  { name: "Compare", price: "$3.00", copy: "Side-by-side research across up to three assets with AI comparison commentary.", icon: GitCompareArrows },
  { name: "Deep Research", price: "$5.00", copy: "Extended sourcing, more documents read, and follow-up analysis on open questions.", icon: Microscope },
];

export default function PricingPage() {
  return (
    <div className="bg-white">
      <PageHeader
        eyebrow="Pay as you go"
        title={
          <>
            No subscriptions.
            <br />
            <span className="bg-gradient-to-r from-violet-soft to-blush bg-clip-text text-transparent">
              Pay only when you research.
            </span>
          </>
        }
        description="No accounts to manage, no monthly plans to forget about. When pricing goes live you'll pay per report — and right now, everything is free."
      />
      <div className="mx-auto max-w-shell px-5 pb-28 pt-16 sm:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`flex flex-col rounded-3xl border p-7 ${
                t.featured
                  ? "border-violet/30 bg-gradient-to-b from-violet-faint to-white shadow-[0_30px_70px_-30px_rgba(140,92,255,0.4)]"
                  : "border-edge bg-white"
              }`}
            >
              <span className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${t.featured ? "bg-violet text-white" : "bg-violet/10 text-violet"}`}>
                <t.icon className="h-5 w-5" />
              </span>
              <h2 className="text-sm font-semibold text-muted">{t.name}</h2>
              <p className="mt-2 font-display text-4xl font-extrabold tracking-tight text-ink">{t.price}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{t.copy}</p>
              <p className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-violet">Future pricing</p>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-4xl border border-edge bg-night p-8 text-center sm:p-14">
          <span className="inline-flex items-center gap-2 rounded-full bg-violet px-4 py-1.5 text-sm font-semibold text-white">
            <Sparkles className="h-4 w-4" />
            Open beta
          </span>
          <h2 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Everything is free right now.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/60">
            All research tools are free during the beta period. Crypto payments — pay-as-you-go in USDC, no wallet
            required to browse — are coming soon.
          </p>
          <Link
            href="/#analyze"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-ink transition-transform hover:scale-[1.03]"
          >
            Use TokenRWA Free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <p className="mt-5 text-xs text-white/40">USDC payments coming soon · No subscriptions · No accounts</p>
        </div>
      </div>
    </div>
  );
}
