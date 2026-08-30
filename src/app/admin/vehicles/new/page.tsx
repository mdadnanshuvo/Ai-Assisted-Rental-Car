"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { AlertCircle, Loader2 } from "lucide-react";
import { VehicleType, Transmission } from "@/types";

const TYPES: VehicleType[] = ["Small Car", "Large Car", "SUV", "Exclusive Car"];
const TRANSMISSIONS: Transmission[] = ["Automatic", "Manual"];
const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "Hybrid"] as const;

export default function CreateProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    brand: "",
    type: "SUV" as VehicleType,
    seats: 5,
    luggage: 2,
    transmission: "Automatic" as Transmission,
    fuelType: "Petrol" as (typeof FUEL_TYPES)[number],
    pricePerDay: 100,
    location: "London",
    features: "",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
    stockCount: 3,
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setServerError(null);

    const res = await fetch("/api/vehicles", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...form,
        features: form.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
      }),
    });
    const json = await res.json();

    if (!res.ok) {
      setStatus("error");
      if (json.issues) {
        const fieldErrors: Record<string, string> = {};
        for (const [k, v] of Object.entries(json.issues)) {
          fieldErrors[k] = Array.isArray(v) ? (v[0] as string) : String(v);
        }
        setErrors(fieldErrors);
      } else {
        setServerError(json.error ?? "Something went wrong");
      }
      return;
    }

    router.push("/admin/vehicles");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Create Product" subtitle="Add a new vehicle to the rental fleet." />

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl rounded-2xl border border-surface-border bg-white p-6"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Vehicle name" error={errors.name}>
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className={inputClass(errors.name)}
              placeholder="Tesla Model Y"
            />
          </Field>
          <Field label="Brand" error={errors.brand}>
            <input
              value={form.brand}
              onChange={(e) => update("brand", e.target.value)}
              className={inputClass(errors.brand)}
              placeholder="Tesla"
            />
          </Field>

          <Field label="Type" error={errors.type}>
            <select
              value={form.type}
              onChange={(e) => update("type", e.target.value as VehicleType)}
              className={inputClass()}
            >
              {TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Fuel type">
            <select
              value={form.fuelType}
              onChange={(e) => update("fuelType", e.target.value as (typeof FUEL_TYPES)[number])}
              className={inputClass()}
            >
              {FUEL_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>

          <Field label="Seats">
            <input
              type="number"
              min={1}
              max={9}
              value={form.seats}
              onChange={(e) => update("seats", parseInt(e.target.value || "0", 10))}
              className={inputClass()}
            />
          </Field>
          <Field label="Luggage">
            <input
              type="number"
              min={0}
              max={10}
              value={form.luggage}
              onChange={(e) => update("luggage", parseInt(e.target.value || "0", 10))}
              className={inputClass()}
            />
          </Field>

          <Field label="Transmission">
            <select
              value={form.transmission}
              onChange={(e) => update("transmission", e.target.value as Transmission)}
              className={inputClass()}
            >
              {TRANSMISSIONS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Price per day ($)" error={errors.pricePerDay}>
            <input
              type="number"
              min={1}
              value={form.pricePerDay}
              onChange={(e) => update("pricePerDay", parseFloat(e.target.value || "0"))}
              className={inputClass(errors.pricePerDay)}
            />
          </Field>

          <Field label="Location" error={errors.location}>
            <input
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              className={inputClass(errors.location)}
            />
          </Field>
          <Field label="Starting stock count">
            <input
              type="number"
              min={0}
              value={form.stockCount}
              onChange={(e) => update("stockCount", parseInt(e.target.value || "0", 10))}
              className={inputClass()}
            />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Image URL" error={errors.image}>
            <input
              value={form.image}
              onChange={(e) => update("image", e.target.value)}
              className={inputClass(errors.image)}
            />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Features (comma-separated)">
            <input
              value={form.features}
              onChange={(e) => update("features", e.target.value)}
              className={inputClass()}
              placeholder="Leather Seats, GPS, Bluetooth"
            />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              className={inputClass()}
            />
          </Field>
        </div>

        {status === "error" && serverError && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-brand-danger-bg px-3 py-2 text-sm text-brand-danger">
            <AlertCircle size={16} /> {serverError}
          </div>
        )}

        <Button type="submit" size="lg" className="mt-6" disabled={status === "loading"}>
          {status === "loading" && <Loader2 size={16} className="animate-spin" />}
          {status === "loading" ? "Creating…" : "Create product"}
        </Button>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-brand-navy">{label}</span>
      {children}
      {error && <span className="text-xs text-brand-danger">{error}</span>}
    </label>
  );
}

function inputClass(error?: string) {
  return `rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand-navy ${
    error ? "border-brand-danger" : "border-surface-border"
  }`;
}
