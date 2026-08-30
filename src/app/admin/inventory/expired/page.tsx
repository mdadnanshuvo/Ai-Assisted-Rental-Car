"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { Vehicle } from "@/types";
import { formatDate } from "@/lib/utils";
import { CalendarClock } from "lucide-react";

export default function ExpiredProductsPage() {
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);

  useEffect(() => {
    fetch("/api/vehicles")
      .then((r) => r.json())
      .then((j) => setVehicles(j.data))
      .catch(() => setVehicles([]));
  }, []);

  const today = new Date();
  const expired = vehicles?.filter((v) => new Date(v.inspectionExpiry) < today) ?? null;
  const expiringSoon =
    vehicles?.filter((v) => {
      const days = (new Date(v.inspectionExpiry).getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      return days >= 0 && days <= 60;
    }) ?? null;

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Expired Products"
        subtitle="Vehicles whose inspection/compliance certificate needs renewal."
      />

      {vehicles === null && <Skeleton className="h-64 rounded-2xl" />}

      {vehicles && (
        <>
          <Section
            title="Expired"
            tone="danger"
            items={expired ?? []}
            emptyLabel="Nothing is currently expired."
          />
          <Section
            title="Expiring within 60 days"
            tone="warning"
            items={expiringSoon ?? []}
            emptyLabel="Nothing expiring soon."
          />
        </>
      )}
    </div>
  );
}

function Section({
  title,
  tone,
  items,
  emptyLabel,
}: {
  title: string;
  tone: "danger" | "warning";
  items: Vehicle[];
  emptyLabel: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-surface-border bg-white">
      <div className="border-b border-surface-border px-5 py-3">
        <h3 className="font-semibold text-brand-navy">{title}</h3>
      </div>

      {items.length === 0 && (
        <div className="py-10 text-center text-sm text-foreground/50">{emptyLabel}</div>
      )}

      {items.map((v) => (
        <div key={v.id} className="flex items-center gap-3 border-b border-surface-border px-5 py-4 last:border-0">
          <div className="relative h-11 w-14 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
            <Image src={v.image} alt={v.name} fill className="object-cover" sizes="56px" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-brand-navy">{v.name}</p>
            <p className="text-xs text-foreground/50">{v.brand} · {v.location}</p>
          </div>
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
              tone === "danger" ? "bg-brand-danger-bg text-brand-danger" : "bg-brand-orange-tint text-brand-orange-dark"
            }`}
          >
            <CalendarClock size={13} /> {formatDate(v.inspectionExpiry)}
          </span>
        </div>
      ))}
    </div>
  );
}
