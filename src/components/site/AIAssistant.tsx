"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import { AIRecommendedVehicle } from "@/types";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  recommendations?: AIRecommendedVehicle[];
  provider?: "gemini" | "anthropic";
}

const SUGGESTIONS = [
  "I need a comfortable SUV for 5 people for a weekend trip",
  "Cheapest small car under $70 a day",
  "Something exclusive for a wedding, budget isn't a concern",
];

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm the BestAuto assistant. Tell me how many people, what kind of trip, and your budget, and I'll match you with real cars from our fleet.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const json = await res.json();
      const data = json.data;
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
          recommendations: data.recommendations,
          provider: data.usedLLM ? data.provider : undefined,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Something went wrong reaching the assistant. Please try again, or browse vehicles directly below.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-navy text-white shadow-xl shadow-brand-navy/30 transition-transform hover:scale-105 cursor-pointer"
        aria-label={open ? "Close AI assistant" : "Open AI vehicle assistant"}
      >
        {open ? <X size={22} /> : <Sparkles size={22} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[32rem] w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-surface-border bg-white shadow-2xl animate-fade-in-up">
          <div className="flex items-center gap-2 bg-brand-navy px-4 py-3.5 text-white">
            <Sparkles size={18} className="text-brand-orange" />
            <div>
              <p className="text-sm font-semibold">Vehicle recommendation assistant</p>
              <p className="text-xs text-white/60">Grounded in live inventory</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex flex-col", m.role === "user" ? "items-end" : "items-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-brand-navy text-white rounded-br-sm"
                      : "bg-surface-muted text-foreground rounded-bl-sm",
                  )}
                >
                  {m.content}
                </div>

                {m.provider && (
                  <span className="mt-1 flex items-center gap-1 text-[10px] font-medium text-foreground/35">
                    <Sparkles size={10} />
                    Answered live by {m.provider === "gemini" ? "Gemini" : "Claude"}
                  </span>
                )}

                {m.recommendations && m.recommendations.length > 0 && (
                  <div className="mt-2 flex w-full flex-col gap-2">
                    {m.recommendations.map((r) => (
                      <Link
                        key={r.vehicle.id}
                        href={`/vehicles/${r.vehicle.id}`}
                        className="flex items-center gap-3 rounded-xl border border-surface-border p-2 transition-colors hover:border-brand-orange"
                      >
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                          <Image src={r.vehicle.image} alt={r.vehicle.name} fill className="object-cover" sizes="64px" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-brand-navy">
                            {r.vehicle.name}
                          </p>
                          <p className="text-xs text-foreground/50">
                            ${r.vehicle.pricePerDay}/day · {r.vehicle.seats} seats
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-brand-orange-tint px-2 py-1 text-[11px] font-semibold text-brand-orange-dark">
                          {r.matchScore}% match
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-foreground/50">
                <Loader2 size={14} className="animate-spin" /> Matching vehicles…
              </div>
            )}

            {messages.length === 1 && (
              <div className="flex flex-col gap-2 pt-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-xl border border-surface-border px-3 py-2 text-left text-xs text-foreground/70 hover:border-brand-orange hover:text-brand-navy"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-surface-border p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. SUV for 5, under $150/day"
              className="flex-1 rounded-full border border-surface-border px-4 py-2 text-sm outline-none focus:border-brand-navy"
              aria-label="Message the vehicle assistant"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white disabled:opacity-40 cursor-pointer"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
