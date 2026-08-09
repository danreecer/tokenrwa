/**
 * AI provider abstraction. Gemini today; the interface is provider-agnostic
 * so another backend can be swapped in by implementing `generateJson` /
 * `generateText` against a different API.
 */

export function aiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

const MODEL = process.env.GEMINI_MODEL ?? "gemini-flash-latest";

async function callGemini(body: unknown): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("ai_not_configured");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 90_000);
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      }
    );
    if (res.status === 429) throw new Error("rate_limited");
    if (!res.ok) throw new Error("ai_unavailable");
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("");
    if (!text) throw new Error("ai_unavailable");
    return text as string;
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") throw new Error("ai_timeout");
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

export async function generateJson(system: string, user: string): Promise<unknown> {
  const text = await callGemini({
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: "user", parts: [{ text: user }] }],
    generationConfig: { temperature: 0.2, responseMimeType: "application/json", maxOutputTokens: 8192 },
  });
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error("ai_bad_output");
  }
}

export async function generateText(system: string, user: string): Promise<string> {
  return callGemini({
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: "user", parts: [{ text: user }] }],
    generationConfig: { temperature: 0.4, maxOutputTokens: 2048 },
  });
}
