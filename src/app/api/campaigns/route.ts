import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { listCampaigns, addCampaign, Campaign } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ data: listCampaigns() });
}

const createSchema = z.object({
  name: z.string().min(2, "Campaign name is required"),
  discountPct: z.number().min(1).max(90),
  vehicleType: z.enum(["Small Car", "Large Car", "Exclusive Car", "SUV", "All"]),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const campaign: Campaign = {
    id: `c-${Date.now()}`,
    active: true,
    ...parsed.data,
  };

  addCampaign(campaign);
  return NextResponse.json({ data: campaign }, { status: 201 });
}
