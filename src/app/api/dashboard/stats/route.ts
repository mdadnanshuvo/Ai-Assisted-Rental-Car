import { NextRequest, NextResponse } from "next/server";
import { dashboardStats } from "@/data/dashboard";
import { listBookings, listVehicles } from "@/lib/store";

// Deterministic range multipliers so the dashboard's date-range control
// genuinely changes the numbers shown, without needing a real historical
// dataset for a 48-hour mock backend.
const RANGE_MULTIPLIERS: Record<string, number> = {
  "7d": 1,
  "30d": 4.1,
  "90d": 11.8,
  "12m": 46,
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") ?? "7d";
  const multiplier = RANGE_MULTIPLIERS[range] ?? 1;

  const allBookings = listBookings();
  const successCount = allBookings.filter((b) => b.status === "Success").length;
  const activeRentals = allBookings.filter((b) => b.status === "Pending").length;
  const availableVehicles = listVehicles().filter((v) => v.available).length;

  return NextResponse.json({
    data: {
      weeklyEarning: Math.round(dashboardStats.weeklyEarning * multiplier * 100) / 100,
      weeklyEarningChangePct: dashboardStats.weeklyEarningChangePct,
      totalSales: Math.round(dashboardStats.totalSales * multiplier) + successCount,
      purchasedGoods: Math.round(dashboardStats.purchasedGoods * multiplier),
      activeRentals: activeRentals || dashboardStats.activeRentals,
      availableVehicles,
      range,
    },
  });
}
