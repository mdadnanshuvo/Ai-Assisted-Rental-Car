"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { Vehicle } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle2, Loader2, Monitor } from "lucide-react";

export default function PosPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [days, setDays] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [reference, setReference] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/vehicles")
      .then((r) => r.json())
      .then((j) => {
        setVehicles(j.data.filter((v: Vehicle) => v.available));
        if (j.data[0]) setSelectedId(j.data[0].id);
      });
  }, []);

  const vehicle = vehicles.find((v) => v.id === selectedId);
  const total = (vehicle?.pricePerDay ?? 0) * days;

  async function checkout(e: React.FormEvent) {
    e.preventDefault();
    if (!vehicle) return;
    setStatus("loading");
    setError(null);

    const today = new Date();
    const dropoff = new Date(today.getTime() + days * 86400000);

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        customerName,
        customerEmail: customerEmail || "walk-in@bestauto.local",
        customerPhone: customerPhone || "N/A (walk-in)",
        vehicleId: vehicle.id,
        pickupLocation: vehicle.location,
        dropoffLocation: vehicle.location,
        pickupDate: today.toISOString().slice(0, 10),
        dropoffDate: dropoff.toISOString().slice(0, 10),
        instant: true,
        source: "Admin",
        payment: "Card",
      }),
    });
    const json = await res.json();

    if (!res.ok) {
      setStatus("error");
      setError(json.error ?? "Checkout failed");
      return;
    }

    setReference(json.data.reference);
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="flex flex-col gap-6">
        <AdminPageHeader title="POS" subtitle="Quick in-person checkout." />
        <div className="flex max-w-md flex-col items-center gap-3 rounded-2xl border border-surface-border bg-white p-10 text-center">
          <CheckCircle2 size={40} className="text-brand-success" />
          <h3 className="text-lg font-semibold text-brand-navy">Sale complete</h3>
          <p className="text-sm text-foreground/60">
            Reference <span className="font-mono font-semibold">{reference}</span> — booking marked
            as Success and visible in Sales.
          </p>
          <Button
            className="mt-2"
            onClick={() => {
              setStatus("idle");
              setCustomerName("");
              setCustomerEmail("");
              setCustomerPhone("");
            }}
          >
            New sale
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="POS" subtitle="Quick in-person checkout for walk-in customers." />

      <form onSubmit={checkout} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-2xl border border-surface-border bg-white p-6">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-brand-navy">Vehicle</span>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="rounded-lg border border-surface-border px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} — ${v.pricePerDay}/day ({v.stockCount} in stock)
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-brand-navy">Days</span>
            <input
              type="number"
              min={1}
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value || "1", 10))}
              className="rounded-lg border border-surface-border px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-brand-navy">Customer name</span>
            <input
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="rounded-lg border border-surface-border px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-brand-navy">Email (optional)</span>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="rounded-lg border border-surface-border px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-brand-navy">Phone (optional)</span>
              <input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="rounded-lg border border-surface-border px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
              />
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-surface-border bg-white p-6">
          <div className="flex items-center gap-2">
            <Monitor size={18} className="text-brand-navy" />
            <h3 className="font-semibold text-brand-navy">Order summary</h3>
          </div>

          <div className="mt-4 flex justify-between text-sm">
            <span className="text-foreground/60">
              {vehicle?.name} × {days} day{days === 1 ? "" : "s"}
            </span>
            <span className="text-brand-navy">{formatCurrency(total)}</span>
          </div>

          <div className="mt-2 flex justify-between border-t border-surface-border pt-3 text-base font-bold text-brand-navy">
            <span>Total due</span>
            <span>{formatCurrency(total)}</span>
          </div>

          {error && <p className="mt-3 text-sm text-brand-danger">{error}</p>}

          <Button type="submit" size="lg" className="mt-5 w-full" disabled={status === "loading" || !vehicle}>
            {status === "loading" && <Loader2 size={16} className="animate-spin" />}
            {status === "loading" ? "Processing…" : "Complete sale"}
          </Button>
        </div>
      </form>
    </div>
  );
}
