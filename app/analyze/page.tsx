import { Suspense } from "react";
import type { Metadata } from "next";
import AnalyzeClient from "./client";

export const metadata: Metadata = {
  title: "Analyze",
  description: "Run AI research on any tokenized real-world asset and get a structured RWA Passport.",
};

export default function AnalyzePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <AnalyzeClient />
    </Suspense>
  );
}
