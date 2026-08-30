import { AIRecommendedVehicle } from "@/types";
import { ExtractedRequirements } from "./recommend";

function buildFallbackReply(
  message: string,
  extracted: ExtractedRequirements,
  recommendations: AIRecommendedVehicle[],
): string {
  if (recommendations.length === 0) {
    return "I couldn't find an available vehicle that matches all of that right now — try loosening your budget or dates, or tell me a bit more about what matters most (seats, price, or vehicle type).";
  }

  const bits: string[] = [];
  if (extracted.seats) bits.push(`seating ${extracted.seats}`);
  if (extracted.type) bits.push(extracted.type.toLowerCase());
  if (extracted.maxBudget) bits.push(`under $${extracted.maxBudget}/day`);
  if (extracted.tripLength) bits.push(`for a ${extracted.tripLength} trip`);

  const criteria = bits.length ? ` ${bits.join(", ")}` : "";
  const top = recommendations[0];

  return `Based on what you told me${criteria}, the best fit is the ${top.vehicle.name} at $${top.vehicle.pricePerDay}/day — ${top.reasons[0]?.toLowerCase() ?? "a strong all-round match"}. I've also lined up ${recommendations.length - 1 || "a couple of"} more option${recommendations.length > 2 ? "s" : ""} below in case you want to compare.`;
}

function buildVehicleSummary(recommendations: AIRecommendedVehicle[]) {
  return recommendations
    .map(
      (r, i) =>
        `${i + 1}. ${r.vehicle.name} (${r.vehicle.type}, ${r.vehicle.seats} seats, $${r.vehicle.pricePerDay}/day, rating ${r.vehicle.rating}) — reasons: ${r.reasons.join("; ")}`,
    )
    .join("\n");
}

const SYSTEM_PROMPT =
  "You are a car rental assistant. You must ONLY recommend vehicles from the provided list, never invent vehicles or prices. Be warm, concise (2-4 sentences), and explain briefly why the top pick fits. Do not use markdown.";

async function callGemini(
  message: string,
  vehicleSummary: string,
  apiKey: string,
): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Customer said: "${message}"\n\nAvailable matched vehicles (already ranked, grounded in real inventory):\n${vehicleSummary}\n\nWrite a short, friendly reply recommending these to the customer.`,
                },
              ],
            },
          ],
          generationConfig: { maxOutputTokens: 220, temperature: 0.6 },
        }),
      },
    );

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      throw new Error(`Gemini API error ${res.status}: ${errBody.slice(0, 200)}`);
    }

    const data = await res.json();
    const text: string | undefined = data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text ?? "")
      .join("")
      .trim();

    if (!text) throw new Error("No text content in Gemini response");
    return text;
  } finally {
    clearTimeout(timeout);
  }
}

async function callAnthropic(
  message: string,
  vehicleSummary: string,
  apiKey: string,
): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 220,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Customer said: "${message}"\n\nAvailable matched vehicles (already ranked, grounded in real inventory):\n${vehicleSummary}\n\nWrite a short, friendly reply recommending these to the customer.`,
          },
        ],
      }),
    });

    if (!res.ok) throw new Error(`Anthropic API error ${res.status}`);

    const data = await res.json();
    const text = data?.content?.find((c: { type: string }) => c.type === "text")?.text;
    if (!text) throw new Error("No text content in response");

    return text.trim();
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Generates the assistant's natural-language reply. Provider priority:
 * Gemini (if GEMINI_API_KEY is set) -> Anthropic (if ANTHROPIC_API_KEY is
 * set) -> deterministic templated fallback. The fallback is built from the
 * exact same grounded, ranked vehicle data, so the assistant never breaks
 * and never contradicts itself even if the LLM call fails or times out.
 */
export async function generateAssistantReply(
  message: string,
  extracted: ExtractedRequirements,
  recommendations: AIRecommendedVehicle[],
): Promise<{ reply: string; usedLLM: boolean; provider?: "gemini" | "anthropic" }> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (recommendations.length === 0 || (!geminiKey && !anthropicKey)) {
    return { reply: buildFallbackReply(message, extracted, recommendations), usedLLM: false };
  }

  const vehicleSummary = buildVehicleSummary(recommendations);

  if (geminiKey) {
    try {
      const reply = await callGemini(message, vehicleSummary, geminiKey);
      return { reply, usedLLM: true, provider: "gemini" };
    } catch (err) {
      console.error("Gemini call failed, falling back:", err);
      if (anthropicKey) {
        try {
          const reply = await callAnthropic(message, vehicleSummary, anthropicKey);
          return { reply, usedLLM: true, provider: "anthropic" };
        } catch (err2) {
          console.error("Anthropic fallback also failed:", err2);
        }
      }
      return { reply: buildFallbackReply(message, extracted, recommendations), usedLLM: false };
    }
  }

  try {
    const reply = await callAnthropic(message, vehicleSummary, anthropicKey!);
    return { reply, usedLLM: true, provider: "anthropic" };
  } catch (err) {
    console.error("Anthropic call failed, falling back:", err);
    return { reply: buildFallbackReply(message, extracted, recommendations), usedLLM: false };
  }
}
