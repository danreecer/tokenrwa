import type { Metadata } from "next";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      <PageHeader eyebrow="Legal" title="Privacy" compact />
      <div className="mx-auto max-w-3xl space-y-6 px-5 pb-28 pt-14 text-[15px] leading-relaxed text-ink/80 sm:px-8">
        <h2 className="font-display text-xl font-bold text-ink">No accounts, no profiles</h2>
        <p>
          TokenRWA has no signup, login or user accounts. We do not build profiles of you and do not sell data.
        </p>
        <h2 className="font-display text-xl font-bold text-ink">What stays in your browser</h2>
        <p>
          Your recent research history is stored only in your browser&apos;s localStorage. Deleting it in the app, or
          clearing your browser storage, removes it entirely. It is never uploaded to our servers.
        </p>
        <h2 className="font-display text-xl font-bold text-ink">What the server processes</h2>
        <p>
          When you run an analysis, the inputs you provide (a URL, contract address or name) are processed server-side
          to fetch public information and generate the report, including being sent to our AI provider for analysis.
          Standard technical logs (such as IP-based rate limiting) are kept only as needed to operate the service.
        </p>
        <h2 className="font-display text-xl font-bold text-ink">Third parties</h2>
        <p>
          Analyses may query public endpoints (such as DexScreener) and fetch the website you supply. Those services
          see the request contents necessary to serve it, under their own policies.
        </p>
      </div>
    </div>
  );
}
