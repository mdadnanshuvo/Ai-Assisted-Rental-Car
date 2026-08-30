"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { Vehicle } from "@/types";
import { ShieldCheck } from "lucide-react";

export default function WarrantiesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);

  useEffect(() => {
    fetch("/api/vehicles")
      .then((r) => r.json())
      .then((j) => setVehicles(j.data))
      .catch(() => setVehicles([]));
  }, []);

  const groups = vehicles
    ? Object.entries(
        vehicles.reduce<Record<string, Vehicle[]>>((acc, v) => {
          (acc[v.warranty] ??= []).push(v);
          return acc;
        }, {}),
      )
    : null;

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Warranties"
        subtitle="Warranty coverage plans currently applied across the fleet."
      />

      {groups === null && <Skeleton className="h-64 rounded-2xl" />}

      {groups?.map(([plan, list]) => (
        <div key={plan} className="overflow-hidden rounded-2xl border border-surface-border bg-white">
          <div className="flex items-center gap-2 border-b border-surface-border px-5 py-3">
            <ShieldCheck size={16} className="text-brand-success" />
            <h3 className="font-semibold text-brand-navy">{plan}</h3>
            <span className="ml-auto text-xs text-foreground/50">{list.length} vehicles</span>
          </div>
          <div className="flex flex-wrap gap-3 p-4">
            {list.map((v) => (
              <div key={v.id} className="flex items-center gap-2 rounded-full border border-surface-border py-1 pl-1 pr-3">
                <div className="relative h-7 w-9 shrink-0 overflow-hidden rounded-full bg-surface-muted">
                  <Image src={v.image} alt={v.name} fill className="object-cover" sizes="36px" />
                </div>
                <span className="text-xs font-medium text-brand-navy">{v.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
