"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { Vehicle } from "@/types";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const LOCATIONS = ["London", "Manchester", "Bristol", "Leeds"];

export default function StockTransferPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [destination, setDestination] = useState(LOCATIONS[0]);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/vehicles")
      .then((r) => r.json())
      .then((j) => {
        setVehicles(j.data);
        if (j.data[0]) setSelectedId(j.data[0].id);
      });
  }, []);

  const vehicle = vehicles.find((v) => v.id === selectedId);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!vehicle) return;
    setSaving(true);
    setDone(null);

    const res = await fetch(`/api/vehicles/${vehicle.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ location: destination }),
    });
    setSaving(false);
    if (!res.ok) return;

    setVehicles((list) => list.map((v) => (v.id === vehicle.id ? { ...v, location: destination } : v)));
    setDone(`${vehicle.name} transferred to ${destination}.`);
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Stock Transfer" subtitle="Move a vehicle between rental locations." />

      <form onSubmit={submit} className="flex max-w-lg flex-col gap-4 rounded-2xl border border-surface-border bg-white p-6">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-brand-navy">Vehicle</span>
          <select
            value={selectedId}
            onChange={(e) => {
              setSelectedId(e.target.value);
              setDone(null);
            }}
            className="rounded-lg border border-surface-border px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} — currently in {v.location}
              </option>
            ))}
          </select>
        </label>

        {vehicle && (
          <div className="flex items-center justify-center gap-3 rounded-lg bg-surface-muted p-4 text-sm font-medium text-brand-navy">
            {vehicle.location}
            <ArrowRight size={16} className="text-foreground/40" />
            {destination}
          </div>
        )}

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-brand-navy">Destination</span>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="rounded-lg border border-surface-border px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
          >
            {LOCATIONS.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </label>

        <Button type="submit" disabled={saving || !vehicle || vehicle.location === destination} className="mt-2">
          {saving ? "Transferring…" : "Confirm transfer"}
        </Button>

        {done && (
          <p className="flex items-center gap-2 text-sm text-brand-success">
            <CheckCircle2 size={16} /> {done}
          </p>
        )}
      </form>
    </div>
  );
}
