"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, BookOpenText, Compass, CreditCard, GitCompareArrows, Menu, ScanSearch, X } from "lucide-react";
import { Wordmark } from "@/components/logo";

const LINKS = [
  { href: "/", label: "Analyze", icon: ScanSearch },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/compare", label: "Compare", icon: GitCompareArrows },
  { href: "/methodology", label: "Methodology", icon: BookOpenText },
  { href: "/pricing", label: "Pricing", icon: CreditCard },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <nav className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-shell items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" aria-label="TokenRWA home" className="shrink-0">
          <Wordmark dark />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[15px] transition-colors ${
                pathname === l.href ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              <l.icon className="h-4 w-4 opacity-70" />
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <span className="rounded-full border border-violet-soft/30 bg-violet/15 px-3 py-1 text-xs font-medium text-violet-lilac">
            Free during beta
          </span>
          <Link
            href="/#analyze"
            className="group inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
          >
            Analyze an RWA
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-white lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="mx-4 rounded-3xl border border-white/10 bg-night/95 p-4 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`inline-flex items-center gap-3 rounded-2xl px-4 py-3 text-base ${
                  pathname === l.href ? "bg-white/10 text-white" : "text-white/70"
                }`}
              >
                <l.icon className="h-5 w-5 text-violet-soft" />
                {l.label}
              </Link>
            ))}
            <Link
              href="/#analyze"
              className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-2xl bg-white px-4 py-3 text-base font-semibold text-ink"
            >
              Analyze an RWA
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <p className="mt-3 text-center text-xs text-violet-lilac">Free during beta · No account required</p>
          </div>
        </div>
      )}
    </nav>
  );
}
