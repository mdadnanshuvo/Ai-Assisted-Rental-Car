"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Vehicle } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { FileText } from "lucide-react";

export default function QuotationPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [days, setDays] = useState(3);
  const [discountPct, setDiscountPct] = useState(0);
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    fetch("/api/vehicles")
      .then((r) => r.json())
      .then((j) => {
        setVehicles(j.data);
        if (j.data[0]) setSelectedId(j.data[0].id);
      });
  }, []);

  const vehicle = vehicles.find((v) => v.id === selectedId);

  const { subtotal, discount, total } = useMemo(() => {
    const sub = (vehicle?.pricePerDay ?? 0) * days;
    const disc = (sub * discountPct) / 100;
    return { subtotal: sub, discount: disc, total: sub - disc };
  }, [vehicle, days, discountPct]);

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Quotation" subtitle="Build a quick price quote for a customer." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-2xl border border-surface-border bg-white p-6">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-brand-navy">Customer name</span>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Optional"
              className="rounded-lg border border-surface-border px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-brand-navy">Vehicle</span>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="rounded-lg border border-surface-border px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} — ${v.pricePerDay}/day
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-brand-navy">Number of days</span>
            <input
              type="number"
              min={1}
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value || "1", 10))}
              className="rounded-lg border border-surface-border px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-brand-navy">Discount (%)</span>
            <input
              type="number"
              min={0}
              max={90}
              value={discountPct}
              onChange={(e) => setDiscountPct(parseInt(e.target.value || "0", 10))}
              className="rounded-lg border border-surface-border px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
            />
          </label>
        </div>

        <div className="rounded-2xl border border-surface-border bg-white p-6">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-brand-navy" />
            <h3 className="font-semibold text-brand-navy">Quote summary</h3>
          </div>

          {customerName && <p className="mt-3 text-sm text-foreground/60">For {customerName}</p>}

          <div className="mt-4 flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground/60">
                {vehicle?.name} × {days} day{days === 1 ? "" : "s"}
              </span>
              <span className="text-brand-navy">{formatCurrency(subtotal)}</span>
            </div>
            {discountPct > 0 && (
              <div className="flex justify-between text-brand-success">
                <span>Discount ({discountPct}%)</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="mt-2 flex justify-between border-t border-surface-border pt-3 text-base font-bold text-brand-navy">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
