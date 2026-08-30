import { NextResponse } from "next/server";
import { revenueSeries, regionSales } from "@/data/dashboard";

export async function GET() {
  return NextResponse.json({ data: { revenue: revenueSeries, regions: regionSales } });
}
