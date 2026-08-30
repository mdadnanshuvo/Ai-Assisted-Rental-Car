"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { Vehicle } from "@/types";

export default function VariantAttributesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);

  useEffect(() => {
    fetch("/api/vehicles")
      .then((r) => r.json())
      .then((j) => setVehicles(j.data))
      .catch(() => setVehicles([]));
  }, []);

  const counts = vehicles
    ? Object.entries(
        vehicles.reduce<Record<string, number>>((acc, v) => {
          for (const f of v.features) acc[f] = (acc[f] ?? 0) + 1;
          return acc;
        }, {}),
      ).sort((a, b) => b[1] - a[1])
    : null;

  const max = counts?.[0]?.[1] ?? 1;

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Variant Attributes"
        subtitle="Feature tags in use across the fleet, and how many vehicles carry each."
      />

      <div className="rounded-2xl border border-surface-border bg-white p-5">
        {counts === null && <Skeleton className="h-64 rounded-xl" />}

        <div className="flex flex-col gap-3">
          {counts?.map(([feature, count]) => (
            <Link
              key={feature}
              href={`/admin/vehicles?search=${encodeURIComponent(feature)}`}
              className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-surface-muted"
            >
              <span className="w-40 shrink-0 truncate text-sm font-medium text-brand-navy">
                {feature}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-muted">
                <div
                  className="h-full rounded-full bg-brand-orange"
                  style={{ width: `${(count / max) * 100}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right text-sm text-foreground/60">{count}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
