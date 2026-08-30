"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { Vehicle } from "@/types";
import { Printer } from "lucide-react";

export default function QrCodePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/vehicles")
      .then((r) => r.json())
      .then((j) => {
        setVehicles(j.data);
        if (j.data[0]) setSelectedId(j.data[0].id);
      });
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    const payload = `bestauto://vehicle/${selectedId}`;
    QRCode.toDataURL(payload, { width: 220, margin: 1, color: { dark: "#092C4C" } })
      .then(setDataUrl)
      .catch(() => setDataUrl(null));
  }, [selectedId]);

  const vehicle = vehicles.find((v) => v.id === selectedId);

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Print QR Code"
        subtitle="Generate a scannable QR code that links directly to a vehicle's detail page."
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

          {vehicle && (
            <div className="mt-4 text-sm text-foreground/60">
              <p>
                <span className="font-medium text-brand-navy">Vehicle ID:</span> {vehicle.id}
              </p>
              <p>
                <span className="font-medium text-brand-navy">Price:</span> ${vehicle.pricePerDay}/day
              </p>
            </div>
          )}

          <Button className="mt-5 w-full" onClick={() => window.print()} disabled={!dataUrl}>
            <Printer size={16} /> Print label
          </Button>
        </div>

        <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-surface-border p-8">
          {dataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- data URL, not an optimizable remote image
            <img src={dataUrl} alt={`QR code for ${vehicle?.name}`} width={220} height={220} />
          ) : (
            <p className="text-sm text-foreground/40">Select a vehicle to generate a code.</p>
          )}
        </div>
      </div>
    </div>
  );
}
