"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Vehicle } from "@/types";
import { TriangleAlert } from "lucide-react";

export default function LowStockPage() {
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  function load() {
    setVehicles(null);
    fetch("/api/vehicles")
      .then((r) => r.json())
      .then((j) => setVehicles(j.data))
      .catch(() => setVehicles([]));
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting to a loading state before an async fetch is intentional here
  useEffect(load, []);

  async function restock(id: string) {
    setBusyId(id);
    await fetch(`/api/vehicles/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ stockCount: 10 }),
    });
    setBusyId(null);
    load();
  }

  const lowStock = vehicles?.filter((v) => v.stockCount <= v.lowStockThreshold) ?? null;

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Low Stocks"
        subtitle="Vehicles at or below their restock threshold."
      />

      <div className="overflow-hidden rounded-2xl border border-surface-border bg-white">
        {lowStock === null &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="px-5 py-4">
              <Skeleton className="h-12 rounded-xl" />
            </div>
          ))}

        {lowStock?.length === 0 && (
          <div className="py-16 text-center text-foreground/50">
            Nothing running low — all vehicles are well stocked.
          </div>
        )}

        {lowStock?.map((v) => (
          <div
            key={v.id}
            className="flex flex-col gap-3 border-b border-surface-border px-5 py-4 last:border-0 sm:flex-row sm:items-center"
          >
            <div className="flex flex-1 items-center gap-3">
              <div className="relative h-11 w-14 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                <Image src={v.image} alt={v.name} fill className="object-cover" sizes="56px" />
              </div>
              <div>
                <p className="font-medium text-brand-navy">{v.name}</p>
                <p className="text-xs text-foreground/50">{v.brand} · {v.location}</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-brand-danger-bg px-3 py-1 text-xs font-medium text-brand-danger">
              <TriangleAlert size={13} /> {v.stockCount} left (threshold {v.lowStockThreshold})
            </span>
            <Button size="sm" variant="secondary" disabled={busyId === v.id} onClick={() => restock(v.id)}>
              {busyId === v.id ? "Restocking…" : "Restock to 10"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
