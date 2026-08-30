"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Booking } from "@/types";
import { formatCurrency } from "@/lib/utils";

export default function SalesReturnPage() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  function load() {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((j) => setBookings(j.data.filter((b: Booking) => b.status !== "Cancelled")))
      .catch(() => setBookings([]));
  }

  useEffect(load, []);

  async function processReturn(id: string) {
    setBusyId(id);
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: "Cancelled" }),
    });
    setBusyId(null);
    load();
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Sales Return"
        subtitle="Process a return or cancellation for an active booking."
      />

      <div className="overflow-hidden rounded-2xl border border-surface-border bg-white">
        {bookings === null &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="px-5 py-4">
              <Skeleton className="h-12 rounded-xl" />
            </div>
          ))}

        {bookings?.length === 0 && (
          <div className="py-16 text-center text-foreground/50">Nothing to return right now.</div>
        )}

        {bookings?.map((b) => (
          <div
            key={b.id}
            className="flex flex-col gap-2 border-b border-surface-border px-5 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-brand-navy">
                {b.customerName} · {b.vehicleName}
              </p>
              <p className="text-xs text-foreground/50">{b.reference}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={b.status} />
              <span className="font-semibold text-brand-navy">{formatCurrency(b.amount)}</span>
              <Button
                size="sm"
                variant="secondary"
                disabled={busyId === b.id}
                onClick={() => processReturn(b.id)}
              >
                {busyId === b.id ? "Processing…" : "Process return"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
