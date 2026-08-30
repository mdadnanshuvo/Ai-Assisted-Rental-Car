import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { listBookings, addBooking, getVehicle, updateVehicle } from "@/lib/store";
import { extractRequirements, recommendVehicles } from "@/lib/ai/recommend";
import { qualifyLead } from "@/lib/leadScore";
import { Booking, BookingStatus } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as BookingStatus | null;
  const search = searchParams.get("search")?.toLowerCase();
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : undefined;

  let results = listBookings();

  if (status && status !== ("All" as BookingStatus)) {
    results = results.filter((b) => b.status === status);
  }

  if (search) {
    results = results.filter(
      (b) =>
        b.customerName.toLowerCase().includes(search) ||
        b.vehicleName.toLowerCase().includes(search) ||
        b.reference.toLowerCase().includes(search),
    );
  }

  results = [...results].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  if (limit) results = results.slice(0, limit);

  return NextResponse.json({ data: results, total: results.length });
}

const inquirySchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("A valid email is required"),
  customerPhone: z.string().min(6, "A valid phone number is required"),
  vehicleId: z.string().min(1, "Please select a vehicle"),
  pickupLocation: z.string().min(2, "Pick-up location is required"),
  dropoffLocation: z.string().min(2, "Drop-off location is required"),
  pickupDate: z.string().min(1, "Pick-up date is required"),
  dropoffDate: z.string().min(1, "Drop-off date is required"),
  notes: z.string().optional().default(""),
  instant: z.boolean().optional().default(false),
  source: z.enum(["Website", "AI Assistant", "Admin"]).optional().default("Website"),
  payment: z
    .enum(["Paypal", "Apple Pay", "Stripe", "PayU", "Paytm", "Card"])
    .optional()
    .default("Card"),
});

/**
 * Automation workflow:
 * inquiry -> validate -> AI qualifies request -> lead score -> store -> respond
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const input = parsed.data;
  const vehicle = getVehicle(input.vehicleId);
  if (!vehicle) {
    return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
  }
  if (!vehicle.available) {
    return NextResponse.json({ error: "Vehicle is not currently available" }, { status: 409 });
  }

  const days = Math.max(
    1,
    Math.ceil(
      (new Date(input.dropoffDate).getTime() - new Date(input.pickupDate).getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );
  const amount = Math.round(days * vehicle.pricePerDay * 100) / 100;

  const qualificationText = `${input.notes} pickup ${input.pickupDate} dropoff ${input.dropoffDate}`;
  const extracted = extractRequirements(qualificationText || vehicle.type);
  const { recommendations } = recommendVehicles(qualificationText || vehicle.name, 3);
  const lead = qualifyLead(qualificationText, extracted, recommendations);

  const booking: Booking = {
    id: `b-${Date.now()}`,
    reference: `#${Math.floor(100000000000 + Math.random() * 899999999999)}`,
    vehicleId: vehicle.id,
    vehicleName: vehicle.name,
    vehicleImage: vehicle.image,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    pickupLocation: input.pickupLocation,
    dropoffLocation: input.dropoffLocation,
    pickupDate: input.pickupDate,
    dropoffDate: input.dropoffDate,
    createdAt: new Date().toISOString(),
    payment: input.payment,
    status: input.instant ? "Success" : "Pending",
    amount,
    source: input.source,
    leadScore: lead.score,
    leadQualification: lead.tier,
    aiNote: lead.note,
  };

  addBooking(booking);
  updateVehicle(vehicle.id, {
    stockCount: Math.max(0, vehicle.stockCount - 1),
    available: vehicle.stockCount - 1 > 0,
  });

  return NextResponse.json({ data: booking }, { status: 201 });
}
