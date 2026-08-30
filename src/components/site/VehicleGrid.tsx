"use client";

import { useEffect, useState } from "react";
import { Vehicle, VehicleType } from "@/types";
import { VehicleCard } from "./VehicleCard";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

const tabs: { label: string; value: VehicleType | "Popular" }[] = [
  { label: "Popular", value: "Popular" },
  { label: "Large Car", value: "Large Car" },
  { label: "Small Car", value: "Small Car" },
  { label: "Exclusive Car", value: "Exclusive Car" },
];

const PAGE_SIZE = 8;

export function VehicleGrid() {
  const [active, setActive] = useState<(typeof tabs)[number]["value"]>("Popular");
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting to a loading state before an async fetch is intentional here
    setVehicles(null);
    setVisible(PAGE_SIZE);

    fetch(`/api/vehicles?type=${encodeURIComponent(active)}`)
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled) setVehicles(json.data);
      })
      .catch(() => {
        if (!cancelled) setVehicles([]);
      });

    return () => {
      cancelled = true;
    };
  }, [active]);

  return (
    <section className="bg-surface-muted py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-brand-navy sm:text-4xl">
            Most popular car rental deals
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-foreground/60">
            A high-performing web-based car rental system for any rent-a-car company and
            website.
          </p>
        </div>

        <div className="mt-10 flex justify-center overflow-x-auto no-scrollbar border-b border-surface-border">
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActive(tab.value)}
                className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${
                  active === tab.value
                    ? "border-brand-navy text-brand-navy"
                    : "border-transparent text-foreground/40 hover:text-foreground/70"
                }`}
                aria-current={active === tab.value}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {vehicles === null &&
            Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}

          {vehicles?.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-surface-border py-16 text-center text-foreground/50">
              No vehicles match this category right now — try another tab.
            </div>
          )}

          {vehicles?.slice(0, visible).map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>

        {vehicles && vehicles.length > visible && (
          <div className="mt-10 flex items-center justify-between">
            <Button variant="secondary" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
              Show more car
            </Button>
            <p className="text-sm text-foreground/50">{vehicles.length} Cars</p>
          </div>
        )}
      </div>
    </section>
  );
}
