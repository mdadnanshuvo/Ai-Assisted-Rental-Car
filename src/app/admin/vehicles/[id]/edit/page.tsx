"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import { Vehicle, VehicleType, Transmission } from "@/types";

const TYPES: VehicleType[] = ["Small Car", "Large Car", "SUV", "Exclusive Car"];
const TRANSMISSIONS: Transmission[] = ["Automatic", "Manual"];
const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "Hybrid"] as const;

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "deleting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/vehicles/${params.id}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((j) => setVehicle(j.data))
      .catch(() => setNotFound(true));
  }, [params.id]);

  function update<K extends keyof Vehicle>(key: K, value: Vehicle[K]) {
    setVehicle((v) => (v ? { ...v, [key]: value } : v));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!vehicle) return;
    setStatus("saving");
    setError(null);

    const res = await fetch(`/api/vehicles/${vehicle.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: vehicle.name,
        pricePerDay: vehicle.pricePerDay,
        location: vehicle.location,
        stockCount: vehicle.stockCount,
        available: vehicle.available,
      }),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setStatus("error");
      setError(json.error ?? "Something went wrong");
      return;
    }

    router.push("/admin/vehicles");
    router.refresh();
  }

  async function handleDelete() {
    if (!vehicle) return;
    if (!confirm(`Delete ${vehicle.name}? This can't be undone.`)) return;

    setStatus("deleting");
    const res = await fetch(`/api/vehicles/${vehicle.id}`, { method: "DELETE" });

    if (!res.ok) {
      setStatus("error");
      setError("Could not delete this vehicle");
      return;
    }

    router.push("/admin/vehicles");
    router.refresh();
  }

  if (notFound) {
    return (
      <div className="flex flex-col gap-6">
        <AdminPageHeader title="Vehicle not found" subtitle="It may have already been deleted." />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex flex-col gap-6">
        <AdminPageHeader title="Edit Product" />
        <Skeleton className="h-96 max-w-2xl rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Edit Product"
        subtitle={`Editing ${vehicle.name} (${vehicle.id})`}
        action={
          <Button variant="secondary" size="sm" onClick={handleDelete} disabled={status === "deleting"}>
            <Trash2 size={15} className="text-brand-danger" />
            {status === "deleting" ? "Deleting…" : "Delete"}
          </Button>
        }
      />

      <form onSubmit={handleSave} className="max-w-2xl rounded-2xl border border-surface-border bg-white p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Vehicle name">
            <input
              value={vehicle.name}
              onChange={(e) => update("name", e.target.value)}
              className={inputClass()}
            />
          </Field>
          <Field label="Brand">
            <input value={vehicle.brand} disabled className={inputClass(undefined, true)} />
          </Field>

          <Field label="Type">
            <select value={vehicle.type} disabled className={inputClass(undefined, true)}>
              {TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Fuel type">
            <select value={vehicle.fuelType} disabled className={inputClass(undefined, true)}>
              {FUEL_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>

          <Field label="Seats">
            <input value={vehicle.seats} disabled className={inputClass(undefined, true)} />
          </Field>
          <Field label="Transmission">
            <select value={vehicle.transmission} disabled className={inputClass(undefined, true)}>
              {TRANSMISSIONS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>

          <Field label="Price per day ($)">
            <input
              type="number"
              min={1}
              value={vehicle.pricePerDay}
              onChange={(e) => update("pricePerDay", parseFloat(e.target.value || "0"))}
              className={inputClass()}
            />
          </Field>
          <Field label="Location">
            <input
              value={vehicle.location}
              onChange={(e) => update("location", e.target.value)}
              className={inputClass()}
            />
          </Field>

          <Field label="Stock count">
            <input
              type="number"
              min={0}
              value={vehicle.stockCount}
              onChange={(e) => update("stockCount", parseInt(e.target.value || "0", 10))}
              className={inputClass()}
            />
          </Field>
          <Field label="Availability">
            <select
              value={vehicle.available ? "yes" : "no"}
              onChange={(e) => update("available", e.target.value === "yes")}
              className={inputClass()}
            >
              <option value="yes">Available</option>
              <option value="no">Unavailable</option>
            </select>
          </Field>
        </div>

        <p className="mt-3 text-xs text-foreground/40">
          Type, brand, fuel type, seats, and transmission are set at creation and shown here
          read-only; delete and recreate the listing to change them.
        </p>

        {status === "error" && error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-brand-danger-bg px-3 py-2 text-sm text-brand-danger">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <Button type="submit" size="lg" disabled={status === "saving"}>
            {status === "saving" && <Loader2 size={16} className="animate-spin" />}
            {status === "saving" ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-brand-navy">{label}</span>
      {children}
    </label>
  );
}

function inputClass(error?: string, disabled?: boolean) {
  return `rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand-navy ${
    error ? "border-brand-danger" : "border-surface-border"
  } ${disabled ? "bg-surface-muted text-foreground/50 cursor-not-allowed" : ""}`;
}
