# TokenRWA AI

**Understand any tokenized asset in seconds.**

The AI research layer for real-world assets onchain. Paste an RWA website, contract address, ticker or project name — TokenRWA gathers available public information, structures it, analyzes it with AI, and generates an **RWA Passport**: backing, token mechanics, yield, redemption, custody, legal signals, liquidity, multichain availability, categorized risks, red flags, due-diligence questions and a deterministic research score, with sources.

No accounts. No wallets. Free during beta.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Lucide · Zod

## Getting started

```bash
npm install
cp .env.example .env.local   # add your GEMINI_API_KEY for live analysis
npm run dev
```

Without `GEMINI_API_KEY`, the app runs in **demo mode**: curated, clearly-labeled demo Passports for OUSG, BUIDL and USDY still work end to end; arbitrary inputs explain that live research needs server configuration. With a key, the full pipeline runs: website research (SSRF-protected fetch + extraction), DexScreener market enrichment, structured AI analysis validated with Zod, and deterministic weighted scoring.

## Architecture

```
app/
  page.tsx            landing (hero + analysis input is the product)
  analyze/            progress state → RWA Passport → contextual AI chat
  compare/            up to 3 assets side-by-side + AI comparison
  explore/            curated RWA catalog (metadata, not live research)
  methodology/        scoring, AI rules, sources, limitations
  pricing/            pay-as-you-go (coming soon) — free during beta
  api/
    analyze/          research pipeline endpoint
    chat/             passport-grounded Q&A
    compare/          multi-asset research + comparison
    token/            public market data lookup
lib/
  ai/                 provider abstraction (Gemini today, swappable)
  research/           input normalization, website research, token data, pipeline
  schemas/            Zod schema for the full RWA Passport (value/confidence/source)
  scoring/            deterministic weighted scoring with evidence discounting
  demo/               curated demo passports + explore catalog
  utils/              export (Markdown/JSON), localStorage history, formatting
```

## Notes

- The overall score is never emitted by the model — it's computed from structured factor assessments with fixed weights, and low evidence pulls scores toward the uncertainty midpoint.
- Recent research is stored only in the browser (localStorage).
- TokenRWA is a research tool, not an investment adviser, broker, exchange, issuer, custodian or law firm.
