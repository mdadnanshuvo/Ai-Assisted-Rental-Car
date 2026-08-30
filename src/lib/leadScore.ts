import { ExtractedRequirements } from "@/lib/ai/recommend";
import { AIRecommendedVehicle } from "@/types";

export interface LeadQualification {
  score: number;
  tier: "Hot" | "Warm" | "Cold";
  note: string;
}

/**
 * Deterministic lead-qualification step of the automation pipeline:
 * inquiry -> validate -> AI-assisted qualification -> score -> store -> surface on dashboard.
 */
export function qualifyLead(
  message: string,
  extracted: ExtractedRequirements,
  recommendations: AIRecommendedVehicle[],
): LeadQualification {
  let score = 40;

  const specificity =
    Number(!!extracted.seats) +
    Number(!!extracted.type) +
    Number(!!extracted.maxBudget) +
    Number(!!extracted.tripLength);
  score += specificity * 10;

  if (recommendations.length && recommendations[0].matchScore >= 70) score += 15;
  if (/book|reserve|today|asap|now/i.test(message)) score += 15;
  if (/just looking|maybe|someday|not sure/i.test(message)) score -= 15;

  score = Math.max(5, Math.min(99, score));

  const tier: LeadQualification["tier"] =
    score >= 75 ? "Hot" : score >= 50 ? "Warm" : "Cold";

  const top = recommendations[0]?.vehicle.name;
  const note = top
    ? `${specificity}/4 requirements specified. Top match: ${top}.`
    : "Low requirement specificity — needs follow-up to narrow options.";

  return { score, tier, note };
}
