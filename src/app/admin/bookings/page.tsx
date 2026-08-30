"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Search, Clock } from "lucide-react";
import { Booking } from "@/types";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusBadge, LeadTierBadge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUSES = ["All", "Success", "Pending", "Cancelled"] as const;

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("All");

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status !== "All") params.set("status", status);

    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting to a loading state before an async fetch is intentional here
    setBookings(null);
    fetch(`/api/bookings?${params.toString()}`)
      .then((r) => r.json())
      .then((j) => setBookings(j.data))
      .catch(() => setBookings([]));
  }, [search, status]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-brand-navy">Sales &amp; Bookings</h1>
        <p className="text-sm text-foreground/50">
          Every rental inquiry, including leads captured by the AI assistant.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-surface-border bg-white p-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-surface-border px-3 py-2">
          <Search size={15} className="text-foreground/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer, vehicle, or reference…"
            className="w-full text-sm outline-none"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                status === s
                  ? "bg-brand-navy text-white"
                  : "border border-surface-border text-foreground/60 hover:bg-surface-muted"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-surface-border bg-white">
        {bookings === null &&
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-5 py-4">
              <Skeleton className="h-14 rounded-xl" />
            </div>
          ))}

        {bookings?.length === 0 && (
          <div className="py-16 text-center text-foreground/50">No bookings match those filters.</div>
        )}

        <div className="flex flex-col divide-y divide-surface-border">
          {bookings?.map((b) => (
            <div key={b.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative h-11 w-14 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                  <Image src={b.vehicleImage} alt={b.vehicleName} fill className="object-cover" sizes="56px" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium text-brand-navy">{b.customerName}</p>
                  <p className="truncate text-xs text-foreground/50">
                    {b.vehicleName} · {b.reference}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:w-auto">
                {b.leadQualification && <LeadTierBadge tier={b.leadQualification} />}
                {b.source === "AI Assistant" && (
                  <span className="rounded-full bg-brand-orange-tint px-2.5 py-1 text-xs font-medium text-brand-orange-dark">
                    AI lead · score {b.leadScore}
                  </span>
                )}
                <StatusBadge status={b.status} />
              </div>

              <div className="flex items-center justify-between gap-4 sm:w-64 sm:justify-end">
                <p className="flex items-center gap-1 text-xs text-foreground/50">
                  <Clock size={12} /> {formatDate(b.createdAt)}
                </p>
                <p className="font-semibold text-brand-navy">{formatCurrency(b.amount)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
