"use client";

import { useEffect, useMemo, useState } from "react";
import { Vehicle, VehicleType } from "@/types";
import { VehicleCard } from "@/components/site/VehicleCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { SlidersHorizontal, Search } from "lucide-react";

const TYPES: (VehicleType | "All")[] = ["All", "Small Car", "Large Car", "SUV", "Exclusive Car"];

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);
  const [type, setType] = useState<(typeof TYPES)[number]>("All");
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(500);
  const [minSeats, setMinSeats] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams();
    if (type !== "All") params.set("type", type);
    if (search) params.set("search", search);
    if (maxPrice < 500) params.set("maxPrice", String(maxPrice));
    if (minSeats > 0) params.set("minSeats", String(minSeats));

    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting to a loading state before an async fetch is intentional here
    setVehicles(null);
    fetch(`/api/vehicles?${params.toString()}`)
      .then((r) => r.json())
      .then((json) => setVehicles(json.data))
      .catch(() => setVehicles([]));
  }, [type, search, maxPrice, minSeats]);

  const count = useMemo(() => vehicles?.length ?? 0, [vehicles]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-brand-navy">Rental Details</h1>
        <p className="text-foreground/60">Browse our full fleet and filter to find your fit.</p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border border-surface-border bg-white p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-brand-navy">
            <SlidersHorizontal size={16} /> Filters
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-foreground/50">
              Search
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-surface-border px-3 py-2">
              <Search size={14} className="text-foreground/40" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Brand, model, city…"
                className="w-full text-sm outline-none"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-foreground/50">
              Vehicle type
            </label>
            <div className="flex flex-col gap-1">
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`rounded-lg px-3 py-2 text-left text-sm ${
                    type === t
                      ? "bg-brand-orange-tint font-semibold text-brand-orange-dark"
                      : "text-foreground/70 hover:bg-surface-muted"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 flex justify-between text-xs font-medium uppercase tracking-wide text-foreground/50">
              <span>Max price / day</span>
              <span className="text-foreground/70">${maxPrice}</span>
            </label>
            <input
              type="range"
              min={50}
              max={500}
              step={10}
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
              className="w-full accent-[var(--brand-orange)]"
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 flex justify-between text-xs font-medium uppercase tracking-wide text-foreground/50">
              <span>Min seats</span>
              <span className="text-foreground/70">{minSeats || "Any"}</span>
            </label>
            <input
              type="range"
              min={0}
              max={7}
              step={1}
              value={minSeats}
              onChange={(e) => setMinSeats(parseInt(e.target.value, 10))}
              className="w-full accent-[var(--brand-orange)]"
            />
          </div>
        </aside>

        <div>
          <p className="mb-4 text-sm text-foreground/50">
            {vehicles === null ? "Loading…" : `${count} car${count === 1 ? "" : "s"} available`}
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {vehicles === null &&
              Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}

            {vehicles?.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-surface-border py-16 text-center text-foreground/50">
                No vehicles match those filters. Try widening your budget or seat count.
              </div>
            )}

            {vehicles?.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
