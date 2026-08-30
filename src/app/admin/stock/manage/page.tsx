"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { Vehicle } from "@/types";
import { Minus, Plus } from "lucide-react";

export default function ManageStockPage() {
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  function load() {
    fetch("/api/vehicles")
      .then((r) => r.json())
      .then((j) => setVehicles(j.data))
      .catch(() => setVehicles([]));
  }

  useEffect(load, []);

  async function adjust(v: Vehicle, delta: number) {
    const next = Math.max(0, v.stockCount + delta);
    setBusyId(v.id);
    setVehicles((list) =>
      list ? list.map((x) => (x.id === v.id ? { ...x, stockCount: next, available: next > 0 } : x)) : list,
    );
    await fetch(`/api/vehicles/${v.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ stockCount: next }),
    });
    setBusyId(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Manage Stock" subtitle="Adjust available units per vehicle in real time." />

      <div className="overflow-hidden rounded-2xl border border-surface-border bg-white">
        {vehicles === null &&
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-5 py-4">
              <Skeleton className="h-12 rounded-xl" />
            </div>
          ))}

        {vehicles?.map((v) => (
          <div
            key={v.id}
            className="flex items-center gap-4 border-b border-surface-border px-5 py-4 last:border-0"
          >
            <div className="relative h-11 w-14 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
              <Image src={v.image} alt={v.name} fill className="object-cover" sizes="56px" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-brand-navy">{v.name}</p>
              <p className="text-xs text-foreground/50">{v.location}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => adjust(v, -1)}
                disabled={busyId === v.id || v.stockCount === 0}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-surface-border text-brand-navy hover:bg-surface-muted disabled:opacity-40"
                aria-label={`Decrease stock for ${v.name}`}
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm font-semibold text-brand-navy">{v.stockCount}</span>
              <button
                onClick={() => adjust(v, 1)}
                disabled={busyId === v.id}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-surface-border text-brand-navy hover:bg-surface-muted disabled:opacity-40"
                aria-label={`Increase stock for ${v.name}`}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
