import Link from "next/link";
import {
  BookOpenText,
  Compass,
  CreditCard,
  FileText,
  GitCompareArrows,
  Globe,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";
import { LogoMark, Wordmark } from "@/components/logo";

function XIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

const PRODUCT_LINKS = [
  { href: "/", label: "Analyze", icon: ScanSearch },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/compare", label: "Compare", icon: GitCompareArrows },
];

const COMPANY_LINKS = [
  { href: "/methodology", label: "Methodology", icon: BookOpenText },
  { href: "/pricing", label: "Pricing", icon: CreditCard },
];

const LEGAL_LINKS = [
  { href: "/terms", label: "Terms", icon: FileText },
  { href: "/privacy", label: "Privacy", icon: ShieldCheck },
];

function FooterCol({ title, links }: { title: string; links: typeof PRODUCT_LINKS }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted">{title}</p>
      <ul className="mt-4 space-y-3 text-[15px]">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="group inline-flex items-center gap-2 text-ink/80 hover:text-ink">
              <l.icon className="h-3.5 w-3.5 text-muted transition-colors group-hover:text-violet" />
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-edge bg-white">
      <LogoMark
        className="pointer-events-none absolute -bottom-24 -right-16 h-96 w-96 text-violet-faint"
      />
      <div className="relative mx-auto max-w-shell px-5 py-20 sm:px-10">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Wordmark />
            <p className="mt-5 font-display text-2xl font-bold leading-snug tracking-tight text-ink">
              The AI research layer for
              <br />
              real-world assets onchain.
            </p>
            <a
              href="https://x.com/danreecer_"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TokenRWA on X"
              className="mt-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-edge text-muted transition-colors hover:border-violet/40 hover:text-violet"
            >
              <XIcon className="h-4 w-4" />
            </a>
            <p className="mt-6 max-w-xs text-[13px] leading-relaxed text-muted/80">
              TokenRWA is a research tool, not an investment adviser, broker, exchange, issuer, custodian or law firm.
              Nothing here is investment advice.
            </p>
            <a
              href="https://orynth.dev/projects/tokenrwa"
              target="_blank"
              rel="noopener"
              className="mt-6 inline-block"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://orynth.dev/api/badge/tokenrwa?theme=light&style=default"
                alt="Featured on Orynth"
                width={260}
                height={80}
              />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <FooterCol title="Product" links={PRODUCT_LINKS} />
            <FooterCol title="Company" links={COMPANY_LINKS} />
            <FooterCol title="Legal" links={LEGAL_LINKS} />
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-2 border-t border-edge pt-8 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 TokenRWA</span>
          <span className="inline-flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5" />
            tokenrwa.net
          </span>
        </div>
      </div>
    </footer>
  );
}
