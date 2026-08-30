"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, Users, Fuel, GaugeCircle } from "lucide-react";
import { Vehicle } from "@/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-surface-border bg-white transition-shadow hover:shadow-lg hover:shadow-brand-navy/5">
      <Link href={`/vehicles/${vehicle.id}`} className="relative block">
        <div className="flex items-center justify-between p-4 pb-0">
          <h3 className="font-semibold text-brand-navy">{vehicle.name}</h3>
          <button
            onClick={(e) => {
              e.preventDefault();
              setSaved((s) => !s);
            }}
            aria-label={saved ? "Remove from saved" : "Save vehicle"}
            aria-pressed={saved}
            className="rounded-full p-1 text-foreground/40 hover:text-brand-orange"
          >
            <Heart size={18} fill={saved ? "var(--brand-orange)" : "none"} className={saved ? "text-brand-orange" : ""} />
          </button>
        </div>
        <div className="relative mt-2 h-40 w-full">
          <Image
            src={vehicle.image}
            alt={vehicle.name}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 25vw, 50vw"
          />
          {!vehicle.available && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm font-semibold text-brand-navy">
              Currently unavailable
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/50">
          <span className="flex items-center gap-1">
            <Users size={13} /> {vehicle.seats} seats
          </span>
          <span className="flex items-center gap-1">
            <GaugeCircle size={13} /> {vehicle.transmission}
          </span>
          <span className="flex items-center gap-1">
            <Fuel size={13} /> {vehicle.fuelType}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <p className="text-lg font-bold text-brand-navy">
            ${vehicle.pricePerDay.toFixed(2)}
            <span className="text-sm font-normal text-foreground/50"> / day</span>
          </p>
          <Link href={`/vehicles/${vehicle.id}`}>
            <Button
              size="sm"
              variant={vehicle.available ? "primary" : "secondary"}
              disabled={!vehicle.available}
              className={cn(!vehicle.available && "cursor-not-allowed")}
            >
              Rent Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
