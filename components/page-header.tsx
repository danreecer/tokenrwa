export default function PageHeader({
  eyebrow,
  title,
  description,
  compact = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  compact?: boolean;
}) {
  return (
    <header className="hero-atmosphere">
      <div className={`mx-auto max-w-shell px-5 sm:px-8 ${compact ? "pb-16 pt-32" : "pb-24 pt-40"}`}>
        {eyebrow && (
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-lilac">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-soft" />
            {eyebrow}
          </p>
        )}
        <h1 className="mt-6 max-w-4xl font-display text-[44px] font-bold leading-[1.02] tracking-[-0.025em] text-white sm:text-[64px]">
          {title}
        </h1>
        {description && <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">{description}</p>}
      </div>
    </header>
  );
}
