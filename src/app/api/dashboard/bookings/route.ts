import { NextResponse } from "next/server";
import { listBookings, getVehicle } from "@/lib/store";
import { bestSellers } from "@/data/bookings";

export async function GET() {
  const recent = [...listBookings()]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const bestSellerVehicles = bestSellers
    .map((b) => {
      const vehicle = getVehicle(b.vehicleId);
      if (!vehicle) return null;
      return { vehicle, sales: b.sales };
    })
    .filter(Boolean);

  return NextResponse.json({ data: { recent, bestSellers: bestSellerVehicles } });
}
