import Image from "next/image";
import Link from "next/link";
import { Vehicle } from "@/types";

export function BestSellerList({
  items,
}: {
  items: { vehicle: Vehicle; sales: number }[];
}) {
  return (
    <div className="rounded-2xl border border-surface-border bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-brand-navy">Best Seller</h3>
        <Link href="/admin/vehicles" className="text-sm font-medium text-foreground/50 hover:text-brand-navy">
          View All
        </Link>
      </div>

      <div className="mt-4 flex flex-col divide-y divide-surface-border">
        {items.map(({ vehicle, sales }) => (
          <div key={vehicle.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
              <Image src={vehicle.image} alt={vehicle.name} fill className="object-cover" sizes="44px" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-brand-navy">{vehicle.name}</p>
              <p className="text-xs text-foreground/50">${vehicle.pricePerDay}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-foreground/40">Sales</p>
              <p className="text-sm font-semibold text-brand-navy">{sales.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
