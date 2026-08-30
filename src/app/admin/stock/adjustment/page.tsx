"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { Vehicle } from "@/types";
import { Check } from "lucide-react";

interface LogEntry {
  id: string;
  vehicleName: string;
  delta: number;
  reason: string;
  time: string;
}

const REASONS = ["Damaged / written off", "New delivery", "Recount correction", "Transferred out"];

export default function StockAdjustmentPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [delta, setDelta] = useState(1);
  const [reason, setReason] = useState(REASONS[0]);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/vehicles")
      .then((r) => r.json())
      .then((j) => {
        setVehicles(j.data);
        if (j.data[0]) setSelectedId(j.data[0].id);
      });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const vehicle = vehicles.find((v) => v.id === selectedId);
    if (!vehicle) return;

    setSaving(true);
    const next = Math.max(0, vehicle.stockCount + delta);
    const res = await fetch(`/api/vehicles/${vehicle.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ stockCount: next }),
    });
    setSaving(false);
    if (!res.ok) return;

    setVehicles((list) => list.map((v) => (v.id === vehicle.id ? { ...v, stockCount: next } : v)));
    setLog((l) => [
      { id: `${Date.now()}`, vehicleName: vehicle.name, delta, reason, time: new Date().toLocaleTimeString() },
      ...l,
    ]);
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Stock Adjustment" subtitle="Apply a manual stock correction with a reason." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <form onSubmit={submit} className="flex flex-col gap-4 rounded-2xl border border-surface-border bg-white p-6">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-brand-navy">Vehicle</span>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="rounded-lg border border-surface-border px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} — currently {v.stockCount} units
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-brand-navy">Adjustment</span>
            <input
              type="number"
              value={delta}
              onChange={(e) => setDelta(parseInt(e.target.value || "0", 10))}
              className="rounded-lg border border-surface-border px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
            />
            <span className="text-xs text-foreground/50">Use a negative number to remove units.</span>
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-brand-navy">Reason</span>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="rounded-lg border border-surface-border px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
            >
              {REASONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>

          <Button type="submit" disabled={saving || !selectedId} className="mt-2">
            {saving ? "Applying…" : "Apply adjustment"}
          </Button>
        </form>

        <div className="rounded-2xl border border-surface-border bg-white p-6">
          <h3 className="font-semibold text-brand-navy">Recent adjustments</h3>
          <div className="mt-4 flex flex-col gap-3">
            {log.length === 0 && (
              <p className="text-sm text-foreground/40">No adjustments applied yet this session.</p>
            )}
            {log.map((entry) => (
              <div key={entry.id} className="flex items-start gap-2 rounded-lg bg-surface-muted p-3 text-sm">
                <Check size={15} className="mt-0.5 shrink-0 text-brand-success" />
                <div>
                  <p className="font-medium text-brand-navy">
                    {entry.vehicleName} {entry.delta > 0 ? "+" : ""}
                    {entry.delta}
                  </p>
                  <p className="text-xs text-foreground/50">
                    {entry.reason} · {entry.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
