"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, MessageCircle, Send } from "lucide-react";
import type { TReport } from "@/lib/schemas/passport";
import { buildChatContext } from "@/lib/utils/export";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "How does redemption work?",
  "What is the biggest counterparty risk?",
  "Explain this like I'm new to tokenized assets.",
  "Why is liquidity scored this way?",
];

export default function ReportChat({ report }: { report: TReport }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);
  busyRef.current = busy;

  const ask = useCallback(async (question: string) => {
    if (!question.trim() || busyRef.current) return;
    let next: Msg[] = [];
    setMessages((prev) => {
      next = [...prev, { role: "user", content: question.trim() }];
      return next;
    });
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          context: buildChatContext(report),
          history: next.slice(-8, -1),
        }),
      });
      const data = await res.json();
      const answer: string = res.ok
        ? data.answer
        : data.message ?? "The assistant is temporarily unavailable. Try again in a moment.";
      setMessages((m) => [...m, { role: "assistant", content: answer }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setBusy(false);
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [report]);

  // Allow other report modules (question rows, sidebar) to drive the chat.
  useEffect(() => {
    function onAsk(e: Event) {
      const q = (e as CustomEvent<string>).detail;
      if (typeof q === "string" && q.trim()) {
        document.getElementById("ask-ai")?.scrollIntoView({ behavior: "smooth", block: "center" });
        ask(q);
      }
    }
    window.addEventListener("tokenrwa-ask", onAsk);
    return () => window.removeEventListener("tokenrwa-ask", onAsk);
  }, [ask]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      id="ask-ai"
      className="no-print scroll-mt-28 rounded-[28px] border border-edge bg-gradient-to-b from-violet-faint/60 to-white p-7 sm:p-9"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet/10 text-violet">
          <MessageCircle className="h-4.5 w-4.5" />
        </span>
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight text-ink">Ask about this asset</h2>
          <p className="text-xs text-muted">Answers are grounded in this Passport&apos;s research context.</p>
        </div>
      </div>

      {messages.length === 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => ask(s)}
              className="rounded-full border border-edge bg-white px-3.5 py-2 text-xs text-muted transition-colors hover:border-violet/40 hover:text-ink"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {messages.length > 0 && (
        <div ref={scrollRef} className="scroll-thin mt-5 max-h-96 space-y-3 overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user" ? "bg-violet text-white" : "border border-edge bg-white text-ink"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {busy && (
            <div className="flex justify-start">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-edge bg-white px-4 py-3 text-sm text-muted">
                <Loader2 className="h-4 w-4 animate-spin text-violet" />
                Thinking…
              </div>
            </div>
          )}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="mt-5 flex items-center gap-2 rounded-2xl border border-edge bg-white p-1.5 focus-within:border-violet/40"
      >
        <label htmlFor="report-chat-input" className="sr-only">
          Ask a question about this asset
        </label>
        <input
          id="report-chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='e.g. "Compare primary redemption to DEX liquidity"'
          className="flex-1 bg-transparent px-3 py-2 text-sm text-ink outline-none placeholder:text-muted/60"
          disabled={busy}
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          aria-label="Send question"
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet text-white transition-opacity disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </motion.section>
  );
}
