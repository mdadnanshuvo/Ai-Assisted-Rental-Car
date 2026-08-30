import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { recommendVehicles } from "@/lib/ai/recommend";
import { generateAssistantReply } from "@/lib/ai/explain";
import { qualifyLead } from "@/lib/leadScore";
import { AIRecommendResponse } from "@/types";

const requestSchema = z.object({
  message: z.string().min(1, "Message is required").max(1000),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { message } = parsed.data;

  try {
    // Ground everything in real vehicle data first.
    const { extracted, recommendations } = recommendVehicles(message, 3);

    // Lead-qualification automation: validate -> qualify -> score.
    // (Storage into the pipeline happens when the user submits an actual
    // inquiry via /api/bookings; this step just scores the conversation.)
    const qualification = qualifyLead(message, extracted, recommendations);

    // Natural-language explanation: LLM if configured, deterministic fallback otherwise.
    const { reply, usedLLM, provider } = await generateAssistantReply(
      message,
      extracted,
      recommendations,
    );

    const response: AIRecommendResponse & {
      leadQualification?: typeof qualification;
      provider?: "gemini" | "anthropic";
    } = {
      reply,
      extracted,
      recommendations,
      usedLLM,
      leadQualification: qualification,
      provider,
    };

    return NextResponse.json({ data: response });
  } catch {
    // The AI feature must never break the site. Return a safe, useful fallback.
    return NextResponse.json({
      data: {
        reply:
          "I'm having trouble reaching the recommendation engine right now. Try browsing our popular vehicles below, or tell me your seats and budget and I'll try again.",
        extracted: {},
        recommendations: [],
        usedLLM: false,
      } satisfies AIRecommendResponse,
    });
  }
}
