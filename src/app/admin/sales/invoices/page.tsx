"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Booking } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Printer } from "lucide-react";

export default function InvoicesPage() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);

  useEffect(() => {
    fetch("/api/bookings?status=Success")
      .then((r) => r.json())
      .then((j) => setBookings(j.data))
      .catch(() => setBookings([]));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Invoices" subtitle="Completed bookings, ready to print or export." />

      <div className="overflow-hidden rounded-2xl border border-surface-border bg-white">
        {bookings === null &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="px-5 py-4">
              <Skeleton className="h-12 rounded-xl" />
            </div>
          ))}

        {bookings?.length === 0 && (
          <div className="py-16 text-center text-foreground/50">No completed bookings yet.</div>
        )}

        {bookings?.map((b) => (
          <div
            key={b.id}
            className="flex flex-col gap-2 border-b border-surface-border px-5 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-brand-navy">{b.reference}</p>
              <p className="text-xs text-foreground/50">
                {b.customerName} · {b.vehicleName} · {formatDate(b.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-brand-navy">{formatCurrency(b.amount)}</span>
              <Button size="sm" variant="secondary" onClick={() => window.print()}>
                <Printer size={14} /> Print
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
