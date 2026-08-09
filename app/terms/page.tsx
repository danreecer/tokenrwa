import type { Metadata } from "next";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <div className="bg-white">
      <PageHeader eyebrow="Legal" title="Terms of Use" compact />
      <div className="mx-auto max-w-3xl space-y-6 px-5 pb-28 pt-14 text-[15px] leading-relaxed text-ink/80 sm:px-8">
        <p>
          TokenRWA is an AI-powered research tool for tokenized real-world assets, provided as-is during an open beta.
          By using it you agree to these terms.
        </p>
        <h2 className="font-display text-xl font-bold text-ink">Not investment advice</h2>
        <p>
          TokenRWA is a research tool, not an investment adviser, broker, exchange, issuer, custodian or law firm.
          Nothing produced by this service — including reports, scores, comparisons and chat answers — is investment,
          legal, tax or accounting advice, or a recommendation to buy, sell or hold any asset.
        </p>
        <h2 className="font-display text-xl font-bold text-ink">Accuracy</h2>
        <p>
          Reports are generated from publicly available information and AI analysis. They may be incomplete, out of
          date or contain errors, and unknowns are an expected part of the output. You are responsible for verifying
          any information before acting on it.
        </p>
        <h2 className="font-display text-xl font-bold text-ink">Acceptable use</h2>
        <p>
          Do not use the service to attack, overload or probe systems, to research destinations you are not permitted
          to access, or to redistribute output in a way that misrepresents it as your own professional advice.
        </p>
        <h2 className="font-display text-xl font-bold text-ink">Liability</h2>
        <p>
          To the maximum extent permitted by law, TokenRWA is provided without warranties of any kind and we accept no
          liability for decisions made on the basis of its output.
        </p>
      </div>
    </div>
  );
}
