import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

export type WebsiteResearch = {
  url: string;
  title: string | null;
  description: string | null;
  headings: string[];
  text: string;
  links: string[];
};

function isPrivateIp(ip: string): boolean {
  if (ip.includes(":")) {
    const lower = ip.toLowerCase();
    return (
      lower === "::1" ||
      lower.startsWith("fc") ||
      lower.startsWith("fd") ||
      lower.startsWith("fe80") ||
      lower.startsWith("::ffff:127.") ||
      lower.startsWith("::ffff:10.") ||
      lower.startsWith("::ffff:192.168.")
    );
  }
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return true;
  const [a, b] = parts;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a >= 224
  );
}

/** Validate a user-supplied URL is a normal public http(s) destination. */
export async function assertPublicUrl(raw: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    throw new Error("invalid_url");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("invalid_url");
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal") || host.endsWith(".localhost")) {
    throw new Error("blocked_url");
  }
  if (isIP(host)) {
    if (isPrivateIp(host)) throw new Error("blocked_url");
    return url;
  }
  try {
    const res = await lookup(host, { all: true });
    if (res.some((r) => isPrivateIp(r.address))) throw new Error("blocked_url");
  } catch (e) {
    if (e instanceof Error && e.message === "blocked_url") throw e;
    throw new Error("dns_failed");
  }
  return url;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

/** Fetch a public website and extract readable text + metadata (no full HTML dump). */
export async function researchWebsite(raw: string): Promise<WebsiteResearch> {
  const url = await assertPublicUrl(raw);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);
  let html: string;
  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "user-agent": "TokenRWA-Research/1.0 (+https://www.tokenrwa.net)",
        accept: "text/html,application/xhtml+xml",
      },
    });
    if (!res.ok) throw new Error("fetch_failed");
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("html") && !ct.includes("text")) throw new Error("fetch_failed");
    html = (await res.text()).slice(0, 800_000);
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") throw new Error("timeout");
    throw e instanceof Error ? e : new Error("fetch_failed");
  } finally {
    clearTimeout(timer);
  }

  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? null;
  const description =
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i)?.[1] ??
    html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
    null;

  const headings: string[] = [];
  for (const m of html.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi)) {
    const t = decodeEntities(m[1].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
    if (t && t.length < 200 && !headings.includes(t)) headings.push(t);
    if (headings.length >= 25) break;
  }

  const links: string[] = [];
  for (const m of html.matchAll(/<a[^>]+href=["'](https?:\/\/[^"'#]+)["']/gi)) {
    try {
      const u = new URL(m[1]);
      if (!links.includes(u.origin + u.pathname)) links.push(u.origin + u.pathname);
    } catch {}
    if (links.length >= 30) break;
  }

  const text = decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 12_000);

  return { url: url.toString(), title: title ? decodeEntities(title) : null, description, headings, text, links };
}
