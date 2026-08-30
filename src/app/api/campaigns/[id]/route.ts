import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { updateCampaign, deleteCampaign } from "@/lib/store";

const patchSchema = z.object({ active: z.boolean() }).partial();

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 422 });
  }

  const updated = updateCampaign(id, parsed.data);
  if (!updated) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });

  return NextResponse.json({ data: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const ok = deleteCampaign(id);
  if (!ok) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  return NextResponse.json({ data: { id, deleted: true } });
}
