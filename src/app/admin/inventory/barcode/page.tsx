"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { Vehicle } from "@/types";
import { Printer } from "lucide-react";

// Deterministic bar pattern derived from the vehicle id — visually a barcode,
// generated locally (not a scannable production format, but consistent and
// reproducible per SKU, which is what "print barcode" needs to demonstrate).
function barsFor(id: string) {
  let seed = 0;
  for (let i = 0; i < id.length; i++) seed = (seed * 31 + id.charCodeAt(i)) >>> 0;

  const bars: number[] = [];
  for (let i = 0; i < 40; i++) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    bars.push(1 + (seed % 3));
  }
  return bars;
}

export default function BarcodePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    fetch("/api/vehicles")
      .then((r) => r.json())
      .then((j) => {
        setVehicles(j.data);
        if (j.data[0]) setSelectedId(j.data[0].id);
      });
  }, []);

  const bars = useMemo(() => (selectedId ? barsFor(selectedId) : []), [selectedId]);
  const vehicle = vehicles.find((v) => v.id === selectedId);

  const { barElements, totalWidth } = useMemo(() => {
    let cursor = 0;
    const elements: React.ReactNode[] = [];
    bars.forEach((w, i) => {
      if (i % 2 === 0) {
        elements.push(<rect key={i} x={cursor} y={0} width={w * 2} height={60} fill="#092C4C" />);
      }
      cursor += w * 2;
    });
    return { barElements: elements, totalWidth: cursor };
  }, [bars]);

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Print Barcode"
        subtitle="Generate a SKU barcode label for a vehicle, ready to print."
      />

      <div className="flex flex-col gap-6 rounded-2xl border border-surface-border bg-white p-6 sm:flex-row sm:items-start">
        <div className="w-full max-w-xs">
          <label className="mb-2 block text-sm font-medium text-brand-navy">Select vehicle</label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full rounded-lg border border-surface-border px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.id})
              </option>
            ))}
          </select>

          <Button className="mt-5 w-full" onClick={() => window.print()} disabled={!vehicle}>
            <Printer size={16} /> Print label
          </Button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-surface-border p-8">
          {vehicle ? (
            <>
              <svg viewBox={`0 0 ${totalWidth} 60`} width={Math.min(totalWidth, 320)} height={60}>
                {barElements}
              </svg>
              <p className="font-mono text-sm tracking-widest text-brand-navy">{vehicle.id.toUpperCase()}</p>
              <p className="text-xs text-foreground/50">{vehicle.name}</p>
            </>
          ) : (
            <p className="text-sm text-foreground/40">Select a vehicle to generate a barcode.</p>
          )}
        </div>
      </div>
    </div>
  );
}
