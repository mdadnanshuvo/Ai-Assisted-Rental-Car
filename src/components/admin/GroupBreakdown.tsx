"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Vehicle } from "@/types";
import { Skeleton } from "@/components/ui/Skeleton";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatCurrency } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface GroupBreakdownProps {
  title: string;
  subtitle: string;
  groupBy: (vehicle: Vehicle) => string;
  linkParam: "type" | "brand" | "fuelType";
}

interface GroupRow {
  key: string;
  count: number;
  totalStock: number;
  avgPrice: number;
}

export function GroupBreakdown({ title, subtitle, groupBy, linkParam }: GroupBreakdownProps) {
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);

  useEffect(() => {
    fetch("/api/vehicles")
      .then((r) => r.json())
      .then((j) => setVehicles(j.data))
      .catch(() => setVehicles([]));
  }, []);

  const rows: GroupRow[] | null = vehicles
    ? Object.values(
        vehicles.reduce<Record<string, GroupRow & { totalPrice: number }>>((acc, v) => {
          const key = groupBy(v);
          if (!acc[key]) acc[key] = { key, count: 0, totalStock: 0, avgPrice: 0, totalPrice: 0 };
          acc[key].count += 1;
          acc[key].totalStock += v.stockCount;
          acc[key].totalPrice += v.pricePerDay;
          acc[key].avgPrice = acc[key].totalPrice / acc[key].count;
          return acc;
        }, {}),
      ).sort((a, b) => b.count - a.count)
    : null;

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title={title} subtitle={subtitle} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows === null &&
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}

        {rows?.map((row) => (
          <Link
            key={row.key}
            href={`/admin/vehicles?${linkParam}=${encodeURIComponent(row.key)}`}
            className="group flex flex-col rounded-2xl border border-surface-border bg-white p-5 transition-colors hover:border-brand-orange"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-brand-navy">{row.key}</h3>
              <ArrowRight
                size={16}
                className="text-foreground/30 transition-transform group-hover:translate-x-1 group-hover:text-brand-orange"
              />
            </div>
            <p className="mt-3 text-2xl font-bold text-brand-navy">{row.count}</p>
            <p className="text-xs text-foreground/50">vehicles</p>
            <div className="mt-4 flex items-center justify-between border-t border-surface-border pt-3 text-xs text-foreground/50">
              <span>{row.totalStock} units in stock</span>
              <span className="font-medium text-brand-navy">
                avg {formatCurrency(row.avgPrice)}/day
              </span>
            </div>
          </Link>
        ))}

        {rows?.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-surface-border py-16 text-center text-foreground/50">
            No vehicles yet.
          </div>
        )}
      </div>
    </div>
  );
}
