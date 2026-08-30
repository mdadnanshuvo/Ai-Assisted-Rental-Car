import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getVehicle, listVehicles } from "@/lib/store";
import { Users, Fuel, GaugeCircle, Briefcase, MapPin, Star, ChevronLeft } from "lucide-react";
import { VehicleCard } from "@/components/site/VehicleCard";
import { VehicleDetailActions } from "./VehicleDetailActions";

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicle = getVehicle(id);

  if (!vehicle) notFound();

  const similar = listVehicles()
    .filter((v) => v.id !== vehicle.id && v.type === vehicle.type)
    .slice(0, 3);

  const specs = [
    { icon: Users, label: `${vehicle.seats} seats` },
    { icon: Briefcase, label: `${vehicle.luggage} bags` },
    { icon: GaugeCircle, label: vehicle.transmission },
    { icon: Fuel, label: vehicle.fuelType },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/vehicles" className="inline-flex items-center gap-1 text-sm text-foreground/60 hover:text-brand-navy">
        <ChevronLeft size={16} /> Back to all cars
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="relative h-72 w-full overflow-hidden rounded-3xl bg-surface-muted sm:h-96">
            <Image src={vehicle.image} alt={vehicle.name} fill className="object-cover" priority sizes="(min-width: 1024px) 55vw, 100vw" />
          </div>

          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-brand-orange-dark">{vehicle.type}</p>
              <h1 className="mt-1 text-3xl font-bold text-brand-navy">{vehicle.name}</h1>
              <div className="mt-2 flex items-center gap-4 text-sm text-foreground/60">
                <span className="flex items-center gap-1">
                  <Star size={14} className="text-brand-orange" fill="currentColor" />
                  {vehicle.rating} ({vehicle.reviewCount} reviews)
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {vehicle.location}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-brand-navy">${vehicle.pricePerDay}</p>
              <p className="text-sm text-foreground/50">per day</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {specs.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center gap-2 rounded-xl border border-surface-border py-4 text-sm text-foreground/70"
              >
                <s.icon size={18} className="text-brand-navy" />
                {s.label}
              </div>
            ))}
          </div>

          <p className="mt-6 leading-relaxed text-foreground/70">{vehicle.description}</p>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-brand-navy">Features</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {vehicle.features.map((f) => (
                <span
                  key={f}
                  className="rounded-full bg-surface-muted px-3 py-1.5 text-xs font-medium text-foreground/70"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        <VehicleDetailActions vehicle={vehicle} />
      </div>

      {similar.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold text-brand-navy">Similar vehicles</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {similar.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
