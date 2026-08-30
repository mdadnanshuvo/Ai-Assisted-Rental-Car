import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getVehicle, updateVehicle, deleteVehicle } from "@/lib/store";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const vehicle = getVehicle(id);

  if (!vehicle) {
    return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
  }

  return NextResponse.json({ data: vehicle });
}

const patchSchema = z
  .object({
    stockCount: z.number().int().min(0),
    available: z.boolean(),
    pricePerDay: z.number().positive(),
    location: z.string().min(1),
    name: z.string().min(2),
  })
  .partial();

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const patch = { ...parsed.data };
  if (typeof patch.stockCount === "number" && patch.available === undefined) {
    (patch as { available?: boolean }).available = patch.stockCount > 0;
  }

  const updated = updateVehicle(id, patch);
  if (!updated) {
    return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
  }

  return NextResponse.json({ data: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const ok = deleteVehicle(id);
  if (!ok) {
    return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
  }
  return NextResponse.json({ data: { id, deleted: true } });
}
