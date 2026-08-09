import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import CompareClient from "./client";

export const metadata: Metadata = {
  title: "Compare",
  description: "Compare up to three tokenized real-world assets side by side with AI research.",
};

export default function ComparePage() {
  return (
    <div className="bg-white">
      <PageHeader
        eyebrow="Compare"
        title={
          <>
            See how tokenized assets
            <br />
            <span className="bg-gradient-to-r from-violet-soft to-blush bg-clip-text text-transparent">
              actually differ.
            </span>
          </>
        }
        description="Enter up to three RWA projects. TokenRWA researches each one and lays the results side by side — structure, liquidity, redemption, custody, eligibility and risk."
        compact
      />
      <CompareClient />
    </div>
  );
}
