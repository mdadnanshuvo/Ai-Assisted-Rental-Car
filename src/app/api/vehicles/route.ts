import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { listVehicles, addVehicle } from "@/lib/store";
import { Vehicle } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const brand = searchParams.get("brand")?.toLowerCase();
  const fuelType = searchParams.get("fuelType");
  const search = searchParams.get("search")?.toLowerCase();
  const minSeats = searchParams.get("minSeats");
  const maxPrice = searchParams.get("maxPrice");

  let results = [...listVehicles()];

  if (type && type !== "Popular") {
    results = results.filter((v) => v.type === type);
  } else if (type === "Popular") {
    results = results.filter((v) => v.popular);
  }

  if (brand) {
    results = results.filter((v) => v.brand.toLowerCase() === brand);
  }

  if (fuelType) {
    results = results.filter((v) => v.fuelType === fuelType);
  }

  if (search) {
    results = results.filter(
      (v) =>
        v.name.toLowerCase().includes(search) ||
        v.brand.toLowerCase().includes(search) ||
        v.location.toLowerCase().includes(search),
    );
  }

  if (minSeats) {
    results = results.filter((v) => v.seats >= parseInt(minSeats, 10));
  }

  if (maxPrice) {
    results = results.filter((v) => v.pricePerDay <= parseInt(maxPrice, 10));
  }

  return NextResponse.json({ data: results, total: results.length });
}

const createSchema = z.object({
  name: z.string().min(2, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  type: z.enum(["Small Car", "Large Car", "Exclusive Car", "SUV"]),
  seats: z.number().int().min(1).max(9),
  luggage: z.number().int().min(0).max(10).default(2),
  transmission: z.enum(["Automatic", "Manual"]).default("Automatic"),
  fuelType: z.enum(["Petrol", "Diesel", "Electric", "Hybrid"]).default("Petrol"),
  pricePerDay: z.number().positive("Price must be greater than 0"),
  location: z.string().min(1, "Location is required"),
  features: z.array(z.string()).default([]),
  image: z.string().url("Provide a valid image URL"),
  stockCount: z.number().int().min(0).default(1),
  description: z.string().optional().default(""),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const input = parsed.data;
  const vehicle: Vehicle = {
    id: `v-${Date.now()}`,
    name: input.name,
    brand: input.brand,
    type: input.type,
    seats: input.seats,
    luggage: input.luggage,
    transmission: input.transmission,
    fuelType: input.fuelType,
    pricePerDay: input.pricePerDay,
    rating: 4.5,
    reviewCount: 0,
    location: input.location,
    features: input.features,
    image: input.image,
    available: input.stockCount > 0,
    popular: false,
    mileage: "Unlimited",
    description: input.description || `${input.name} — recently added to the fleet.`,
    stockCount: input.stockCount,
    lowStockThreshold: 3,
    inspectionExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString().slice(0, 10),
    warranty: "Manufacturer (2 yrs)",
  };

  addVehicle(vehicle);

  return NextResponse.json({ data: vehicle }, { status: 201 });
}
