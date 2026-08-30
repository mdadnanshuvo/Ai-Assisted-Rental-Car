"use client";

import { useEffect, useState } from "react";
import { Wallet2, ShoppingBag, PackageCheck, CalendarRange, RotateCcw } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { BestSellerList } from "@/components/admin/BestSellerList";
import { TransactionsTable } from "@/components/admin/TransactionsTable";
import { SalesAnalyticsChart } from "@/components/admin/SalesAnalyticsChart";
import { SalesByCountries } from "@/components/admin/SalesByCountries";
import { Skeleton } from "@/components/ui/Skeleton";
import { DashboardStats, RevenuePoint, RegionSales, Booking, Vehicle } from "@/types";
import { formatCurrency, formatCompactNumber } from "@/lib/utils";
import { useCurrentUser } from "@/lib/useCurrentUser";

type BestSellerEntry = { vehicle: Vehicle; sales: number };

const RANGES: { value: string; label: string }[] = [
  { value: "7d", label: "01 Jan 2024 - 07 Jan 2024" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "12m", label: "Last 12 months" },
];

export default function AdminDashboardPage() {
  const { user } = useCurrentUser();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenue, setRevenue] = useState<RevenuePoint[] | null>(null);
  const [regions, setRegions] = useState<RegionSales[] | null>(null);
  const [recent, setRecent] = useState<Booking[] | null>(null);
  const [bestSellers, setBestSellers] = useState<BestSellerEntry[] | null>(null);
  const [statusFilter, setStatusFilter] = useState<"All" | Booking["status"]>("All");
  const [range, setRange] = useState(RANGES[0].value);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting to a loading state before an async fetch is intentional here
    setStats(null);
    fetch(`/api/dashboard/stats?range=${range}`)
      .then((r) => r.json())
      .then((j) => setStats(j.data));

    fetch("/api/dashboard/revenue")
      .then((r) => r.json())
      .then((j) => {
        setRevenue(j.data.revenue);
        setRegions(j.data.regions);
      });
  }, [range]);

  useEffect(() => {
    const params = new URLSearchParams({ limit: "5" });
    if (statusFilter !== "All") params.set("status", statusFilter);

    fetch(`/api/dashboard/bookings?${params.toString()}`)
      .then((r) => r.json())
      .then((j) => setBestSellers(j.data.bestSellers));

    fetch(`/api/bookings?${params.toString()}`)
      .then((r) => r.json())
      .then((j) => setRecent(j.data));
  }, [statusFilter]);

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-surface-border bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-lg font-semibold text-brand-navy">
          👋 Hi {user?.name?.split(" ")[0] ?? "there"}, here&apos;s what&apos;s happening with your store today.
        </p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-surface-border px-3 py-2 text-sm text-foreground/60">
            <CalendarRange size={15} />
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="bg-transparent outline-none"
              aria-label="Date range"
            >
              {RANGES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <button
            className="rounded-lg border border-surface-border p-2 text-foreground/50 hover:bg-surface-muted"
            aria-label="Reset range"
            onClick={() => setRange(RANGES[0].value)}
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats ? (
          <>
            <StatCard
              label="Weekly Earning"
              value={formatCurrency(stats.weeklyEarning)}
              changePct={stats.weeklyEarningChangePct}
              icon={<Wallet2 size={44} className="text-brand-orange/30" />}
            />
            <StatCard
              variant="orange"
              label="Total Sales"
              value={`${formatCompactNumber(stats.totalSales)}+`}
              icon={<ShoppingBag size={30} className="text-white/70" />}
            />
            <StatCard
              variant="navy"
              label="Purchased Goods"
              value={`${stats.purchasedGoods}+`}
              icon={<PackageCheck size={30} className="text-white/60" />}
            />
          </>
        ) : (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)
        )}
      </div>

      {/* Best sellers + transactions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.6fr]">
        {bestSellers ? (
          <BestSellerList items={bestSellers} />
        ) : (
          <Skeleton className="h-96 rounded-2xl" />
        )}

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2 self-end">
            {(["All", "Success", "Pending", "Cancelled"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === s
                    ? "bg-brand-navy text-white"
                    : "bg-white text-foreground/60 border border-surface-border hover:bg-surface-muted"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          {recent ? (
            <TransactionsTable bookings={recent} />
          ) : (
            <Skeleton className="h-96 rounded-2xl" />
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        {revenue ? <SalesAnalyticsChart data={revenue} /> : <Skeleton className="h-96 rounded-2xl" />}
        {regions ? <SalesByCountries regions={regions} /> : <Skeleton className="h-96 rounded-2xl" />}
      </div>
    </div>
  );
}
