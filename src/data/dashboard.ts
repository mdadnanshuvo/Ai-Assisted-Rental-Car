import { DashboardStats, RevenuePoint, RegionSales } from "@/types";

export const dashboardStats: DashboardStats = {
  weeklyEarning: 95000.45,
  weeklyEarningChangePct: 48,
  totalSales: 10234,
  purchasedGoods: 842,
  activeRentals: 84,
  availableVehicles: 132,
};

export const revenueSeries: RevenuePoint[] = [
  { month: "Jan", revenue: 28000 },
  { month: "Feb", revenue: 21000 },
  { month: "Mar", revenue: 16500 },
  { month: "Apr", revenue: 19500 },
  { month: "May", revenue: 15800 },
  { month: "Jun", revenue: 31000 },
  { month: "July", revenue: 20500 },
  { month: "Aug", revenue: 22500 },
  { month: "Sep", revenue: 19800 },
];

export const regionSales: RegionSales[] = [
  { region: "North America", sales: 2210 },
  { region: "South America", sales: 980 },
  { region: "Europe", sales: 1870 },
  { region: "Africa", sales: 3455, highlighted: true },
  { region: "Asia", sales: 2640 },
  { region: "Oceania", sales: 640 },
];
