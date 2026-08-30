"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, SlidersHorizontal, Star, Plus, Pencil } from "lucide-react";
import { Vehicle, VehicleType } from "@/types";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

const TYPES: (VehicleType | "All")[] = ["All", "Small Car", "Large Car", "SUV", "Exclusive Car"];

function AdminVehiclesContent() {
  const searchParams = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [type, setType] = useState<(typeof TYPES)[number]>(
    (searchParams.get("type") as (typeof TYPES)[number]) ?? "All",
  );
  const brand = searchParams.get("brand");
  const fuelType = searchParams.get("fuelType");

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (type !== "All") params.set("type", type);
    if (brand) params.set("brand", brand);
    if (fuelType) params.set("fuelType", fuelType);

    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting to a loading state before an async fetch is intentional here
    setVehicles(null);
    fetch(`/api/vehicles?${params.toString()}`)
      .then((r) => r.json())
      .then((j) => setVehicles(j.data))
      .catch(() => setVehicles([]));
  }, [search, type, brand, fuelType]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Products</h1>
          <p className="text-sm text-foreground/50">Manage your rental fleet inventory.</p>
        </div>
        <Link href="/admin/vehicles/new">
          <Button size="sm">
            <Plus size={15} /> Add New
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-surface-border bg-white p-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-surface-border px-3 py-2">
          <Search size={15} className="text-foreground/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, brand, or location…"
            className="w-full text-sm outline-none"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <SlidersHorizontal size={15} className="shrink-0 text-foreground/40" />
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                type === t
                  ? "bg-brand-navy text-white"
                  : "border border-surface-border text-foreground/60 hover:bg-surface-muted"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-surface-border bg-white">
        <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 border-b border-surface-border px-5 py-3 text-xs font-semibold uppercase tracking-wide text-foreground/40 md:grid">
          <span>Vehicle</span>
          <span>Type</span>
          <span>Seats</span>
          <span>Rating</span>
          <span>Price / day</span>
          <span>Stock</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {vehicles === null &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="px-5 py-4">
              <Skeleton className="h-12 rounded-xl" />
            </div>
          ))}

        {vehicles?.length === 0 && (
          <div className="py-16 text-center text-foreground/50">No vehicles match those filters.</div>
        )}

        {vehicles?.map((v) => (
          <div
            key={v.id}
            className="grid grid-cols-1 gap-3 border-b border-surface-border px-5 py-4 last:border-0 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] md:items-center md:gap-4"
          >
            <Link href={`/vehicles/${v.id}`} className="flex items-center gap-3">
              <div className="relative h-11 w-14 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                <Image src={v.image} alt={v.name} fill className="object-cover" sizes="56px" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium text-brand-navy">{v.name}</p>
                <p className="text-xs text-foreground/50">{v.brand} · {v.location}</p>
              </div>
            </Link>
            <span className="text-sm text-foreground/70">{v.type}</span>
            <span className="text-sm text-foreground/70">{v.seats} seats</span>
            <span className="flex items-center gap-1 text-sm text-foreground/70">
              <Star size={13} className="text-brand-orange" fill="currentColor" /> {v.rating}
            </span>
            <span className="text-sm font-semibold text-brand-navy">{formatCurrency(v.pricePerDay)}</span>
            <span
              className={`text-sm font-medium ${v.stockCount <= v.lowStockThreshold ? "text-brand-danger" : "text-foreground/70"}`}
            >
              {v.stockCount} units
            </span>
            <span>
              <span
                className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                  v.available ? "bg-brand-success-bg text-brand-success" : "bg-brand-danger-bg text-brand-danger"
                }`}
              >
                {v.available ? "Available" : "Unavailable"}
              </span>
            </span>
            <Link
              href={`/admin/vehicles/${v.id}/edit`}
              className="inline-flex w-fit items-center gap-1 rounded-lg border border-surface-border px-3 py-1.5 text-xs font-medium text-brand-navy hover:bg-surface-muted"
            >
              <Pencil size={12} /> Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminVehiclesPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
      <AdminVehiclesContent />
    </Suspense>
  );
}
