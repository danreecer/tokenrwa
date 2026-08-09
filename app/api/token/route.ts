import { NextResponse } from "next/server";
import { fetchTokenMarketData } from "@/lib/research/token";
import { clientKey, rateLimit } from "@/lib/utils/ratelimit";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  if (!q || q.length > 200) {
    return NextResponse.json({ error: "bad_request", message: "Provide a token query." }, { status: 400 });
  }
  if (!rateLimit(`token:${clientKey(req)}`, 30, 60_000)) {
    return NextResponse.json({ error: "rate_limited", message: "Too many requests." }, { status: 429 });
  }
  const market = await fetchTokenMarketData(q);
  return NextResponse.json({ market });
}
