import { NextResponse } from "next/server";
import { z } from "zod";
import { aiConfigured, generateText } from "@/lib/ai/provider";
import { clientKey, rateLimit } from "@/lib/utils/ratelimit";

export const maxDuration = 60;

const Body = z.object({
  question: z.string().min(1).max(1000),
  context: z.string().min(1).max(60_000),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) }))
    .max(12)
    .optional(),
});

const SYSTEM = `You are TokenRWA's research assistant. Answer questions about ONE specific tokenized real-world asset using ONLY the research context provided.

Rules:
- Ground every answer in the research context. If the context doesn't contain the answer, say so plainly and suggest what the user could verify (issuer documents, contract, etc.).
- Never invent facts, figures, yields, custodians, or legal details.
- Never give personalized investment advice or tell the user to buy/sell. If asked, explain you're a research tool and describe the relevant factual considerations instead.
- Be concise and plain-spoken. Short paragraphs. Explain jargon when it appears.
- When explaining scores, refer to the factor assessments and evidence levels in the context.`;

export async function POST(req: Request) {
  if (!aiConfigured()) {
    return NextResponse.json(
      {
        error: "ai_not_configured",
        message: "The research chat needs live AI, which requires server configuration (GEMINI_API_KEY).",
      },
      { status: 503 }
    );
  }
  if (!rateLimit(`chat:${clientKey(req)}`, 20, 60_000)) {
    return NextResponse.json(
      { error: "rate_limited", message: "Too many questions right now — give it a minute." },
      { status: 429 }
    );
  }
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "bad_request", message: "Ask a question about this asset." }, { status: 400 });
  }
  try {
    const historyText = (body.history ?? [])
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");
    const answer = await generateText(
      SYSTEM,
      `RESEARCH CONTEXT:\n${body.context}\n\n${historyText ? `CONVERSATION SO FAR:\n${historyText}\n\n` : ""}QUESTION: ${body.question}`
    );
    return NextResponse.json({ answer: answer.trim() });
  } catch {
    return NextResponse.json(
      { error: "ai_unavailable", message: "The assistant is temporarily unavailable. Try again in a moment." },
      { status: 502 }
    );
  }
}
