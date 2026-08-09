import { NextResponse } from "next/server";
import { z } from "zod";
import { aiConfigured } from "@/lib/ai/provider";
import { getDemoReport } from "@/lib/demo/assets";
import { AnalyzeError, normalizeInput, runAnalysis } from "@/lib/research/analyze";
import { clientKey, rateLimit } from "@/lib/utils/ratelimit";

export const maxDuration = 120;

const Body = z.object({
  query: z.string().max(300).optional(),
  name: z.string().max(200).optional(),
  website: z.string().max(500).optional(),
  contract: z.string().max(200).optional(),
  network: z.string().max(50).optional(),
});

const ERROR_MESSAGES: Record<string, string> = {
  empty_input: "Enter a website, contract address, ticker or project name to analyze.",
  invalid_url: "That doesn't look like a valid public website URL. Check the address and try again.",
  blocked_url: "Only normal public websites can be researched.",
  timeout: "The website took too long to respond. Try again, or analyze by name or contract instead.",
  fetch_failed: "We couldn't read that website. Try again, or analyze by name or contract instead.",
  dns_failed: "We couldn't resolve that website's address. Check the URL and try again.",
  ai_not_configured:
    "Live AI research needs server configuration (GEMINI_API_KEY). You can still open the demo Passports for OUSG, BUIDL or USDY.",
  ai_unavailable: "The AI research engine is temporarily unavailable. Please try again in a moment.",
  ai_timeout: "Research took too long to complete. Please try again.",
  ai_bad_output: "We couldn't build a complete Passport from the available information. Try adding the project's official website or contract address.",
  rate_limited: "Too many analyses right now. Please wait a minute and try again.",
};

export async function POST(req: Request) {
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "empty_input", message: ERROR_MESSAGES.empty_input }, { status: 400 });
  }

  const norm = normalizeInput(body);
  if (!norm.label) {
    return NextResponse.json({ error: "empty_input", message: ERROR_MESSAGES.empty_input }, { status: 400 });
  }

  if (!aiConfigured()) {
    const demo = getDemoReport(norm.label);
    if (demo) return NextResponse.json({ report: demo });
    return NextResponse.json(
      { error: "ai_not_configured", message: ERROR_MESSAGES.ai_not_configured },
      { status: 503 }
    );
  }

  if (!rateLimit(`analyze:${clientKey(req)}`, 10, 60_000)) {
    return NextResponse.json({ error: "rate_limited", message: ERROR_MESSAGES.rate_limited }, { status: 429 });
  }

  try {
    const report = await runAnalysis(body);
    return NextResponse.json({ report });
  } catch (e) {
    const code = e instanceof AnalyzeError || e instanceof Error ? e.message : "ai_unavailable";
    const known = code in ERROR_MESSAGES ? code : "ai_unavailable";
    const status = known === "rate_limited" ? 429 : known.startsWith("ai") ? 502 : 400;
    return NextResponse.json({ error: known, message: ERROR_MESSAGES[known] }, { status });
  }
}
