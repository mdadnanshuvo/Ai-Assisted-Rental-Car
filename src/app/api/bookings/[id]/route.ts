import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getBookingById, updateBooking } from "@/lib/store";

const patchSchema = z.object({
  status: z.enum(["Success", "Pending", "Cancelled"]),
});

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

  const existing = getBookingById(id);
  if (!existing) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const updated = updateBooking(id, { status: parsed.data.status });
  return NextResponse.json({ data: updated });
}
