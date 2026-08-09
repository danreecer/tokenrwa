/**
 * TokenRWA mark: three fragmented pieces resolving into one token shape.
 * Flat, works in black / white / purple via currentColor.
 */
export function LogoMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path d="M16 3 L28 10 L16 17 L4 10 Z" fill="currentColor" opacity="0.95" />
      <path d="M4 14 L14 19.8 L14 29 L4 23.2 Z" fill="currentColor" opacity="0.55" />
      <path d="M28 14 L18 19.8 L18 29 L28 23.2 Z" fill="currentColor" opacity="0.75" />
    </svg>
  );
}

export function Wordmark({ dark = false }: { dark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark className={`h-6 w-6 ${dark ? "text-white" : "text-ink"}`} />
      <span
        className={`font-display text-[17px] font-extrabold tracking-tight ${dark ? "text-white" : "text-ink"}`}
      >
        Token<span className="text-violet">RWA</span>
      </span>
    </span>
  );
}
