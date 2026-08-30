import { AIRecommendedVehicle, Vehicle, VehicleType } from "@/types";
import { listVehicles } from "@/lib/store";

export interface ExtractedRequirements {
  seats?: number;
  type?: VehicleType;
  maxBudget?: number;
  tripLength?: string;
  features?: string[];
  electricPreferred?: boolean;
}

const TYPE_KEYWORDS: Record<VehicleType, string[]> = {
  SUV: ["suv", "4x4", "off-road", "off road", "jeep"],
  "Small Car": [
    "small car",
    "compact",
    "city car",
    "cheap",
    "economy",
    "budget car",
    "hatchback",
  ],
  "Exclusive Car": [
    "exclusive",
    "luxury",
    "sports car",
    "premium",
    "executive",
    "wedding",
    "special occasion",
  ],
  "Large Car": ["large car", "family car", "estate", "saloon", "sedan"],
};

const FEATURE_KEYWORDS = [
  "leather seats",
  "gps",
  "bluetooth",
  "4x4",
  "panoramic roof",
  "heated seats",
  "cruise control",
  "reverse camera",
  "premium sound",
  "chauffeur available",
];

export function extractRequirements(message: string): ExtractedRequirements {
  const text = message.toLowerCase();
  const req: ExtractedRequirements = {};

  const seatsMatch =
    text.match(/(\d+)\s*(?:people|passengers|persons|seats|seater)/) ||
    text.match(/(?:for|of)\s+(\d+)\b/);
  if (seatsMatch) {
    const n = parseInt(seatsMatch[1], 10);
    if (n > 0 && n <= 9) req.seats = n;
  }

  for (const [type, keywords] of Object.entries(TYPE_KEYWORDS) as [
    VehicleType,
    string[],
  ][]) {
    if (keywords.some((k) => text.includes(k))) {
      req.type = type;
      break;
    }
  }

  const budgetMatch =
    text.match(/(?:under|below|less than|max|budget of|up to)\s*\$?(\d+)/) ||
    text.match(/\$(\d+)\s*(?:\/|a|per)?\s*day/);
  if (budgetMatch) {
    req.maxBudget = parseInt(budgetMatch[1], 10);
  }

  if (/weekend/.test(text)) req.tripLength = "weekend";
  else if (/week\b/.test(text)) req.tripLength = "week";
  else if (/(one|1|single)\s*day/.test(text)) req.tripLength = "day";
  else if (/month/.test(text)) req.tripLength = "month";

  if (/electric|ev\b|zero.?emission/.test(text)) req.electricPreferred = true;

  const features = FEATURE_KEYWORDS.filter((f) => text.includes(f));
  if (features.length) req.features = features;

  return req;
}

function scoreVehicle(
  vehicle: Vehicle,
  req: ExtractedRequirements,
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  if (!vehicle.available) return { score: -1, reasons: [] };

  if (req.seats) {
    if (vehicle.seats >= req.seats) {
      score += 30;
      reasons.push(`Seats ${vehicle.seats}, enough for your group of ${req.seats}`);
    } else {
      score -= 25;
    }
  } else {
    score += 5;
  }

  if (req.type) {
    if (vehicle.type === req.type) {
      score += 25;
      reasons.push(`Matches the ${req.type.toLowerCase()} category you asked for`);
    } else {
      score -= 5;
    }
  }

  if (req.maxBudget) {
    if (vehicle.pricePerDay <= req.maxBudget) {
      score += 20;
      reasons.push(`$${vehicle.pricePerDay}/day fits your budget`);
    } else {
      const over = vehicle.pricePerDay - req.maxBudget;
      score -= Math.min(30, over / 2);
    }
  }

  if (req.electricPreferred) {
    if (vehicle.fuelType === "Electric" || vehicle.fuelType === "Hybrid") {
      score += 15;
      reasons.push(`${vehicle.fuelType} powertrain`);
    } else {
      score -= 10;
    }
  }

  if (req.features?.length) {
    const matched = req.features.filter((f) =>
      vehicle.features.some((vf) => vf.toLowerCase() === f),
    );
    score += matched.length * 8;
    if (matched.length) {
      reasons.push(`Includes ${matched.join(", ")}`);
    }
  }

  if (req.tripLength === "weekend" || req.tripLength === "week") {
    if (vehicle.luggage >= 2) {
      score += 5;
      reasons.push(`${vehicle.luggage} luggage bags of space for the trip`);
    }
  }

  score += vehicle.rating * 4;
  if (vehicle.popular) score += 5;

  if (reasons.length === 0) {
    reasons.push(`Highly rated (${vehicle.rating}★) and currently available`);
  }

  return { score, reasons };
}

export function recommendVehicles(
  message: string,
  limit = 3,
): { extracted: ExtractedRequirements; recommendations: AIRecommendedVehicle[] } {
  const extracted = extractRequirements(message);

  const scored = listVehicles()
    .map((vehicle) => {
      const { score, reasons } = scoreVehicle(vehicle, extracted);
      return { vehicle, matchScore: score, reasons };
    })
    .filter((r) => r.matchScore > -20)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);

  const maxScore = Math.max(...scored.map((s) => s.matchScore), 1);
  const normalized = scored.map((s) => ({
    ...s,
    matchScore: Math.max(5, Math.min(99, Math.round((s.matchScore / maxScore) * 99))),
  }));

  return { extracted, recommendations: normalized };
}
