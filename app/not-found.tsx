import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-white">
      <div className="hero-atmosphere h-40" aria-hidden="true" />
      <div className="mx-auto max-w-xl px-5 pb-28 pt-16 text-center sm:px-8">
        <p className="font-display text-6xl font-extrabold tracking-tight text-violet-lilac">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-ink">This page doesn&apos;t exist</h1>
        <p className="mt-3 text-sm text-muted">But every tokenized asset deserves a closer look.</p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-violet px-6 py-3 text-sm font-semibold text-white hover:bg-violet/90"
        >
          Analyze an RWA
        </Link>
      </div>
    </div>
  );
}
