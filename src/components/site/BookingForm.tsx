"use client";

import { useState } from "react";
import { Vehicle } from "@/types";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface Props {
  vehicle: Vehicle;
  onSuccess?: () => void;
}

interface FormState {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  dropoffDate: string;
  notes: string;
}

const initialState: FormState = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  pickupLocation: "",
  dropoffLocation: "",
  pickupDate: "",
  dropoffDate: "",
  notes: "",
};

export function BookingForm({ vehicle, onSuccess }: Props) {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (form.customerName.trim().length < 2) next.customerName = "Enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(form.customerEmail)) next.customerEmail = "Enter a valid email";
    if (form.customerPhone.trim().length < 6) next.customerPhone = "Enter a valid phone number";
    if (!form.pickupLocation) next.pickupLocation = "Required";
    if (!form.dropoffLocation) next.dropoffLocation = "Required";
    if (!form.pickupDate) next.pickupDate = "Required";
    if (!form.dropoffDate) next.dropoffDate = "Required";
    if (form.pickupDate && form.dropoffDate && form.dropoffDate < form.pickupDate) {
      next.dropoffDate = "Must be after pick-up date";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setServerError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, vehicleId: vehicle.id }),
      });
      const json = await res.json();

      if (!res.ok) {
        setServerError(json.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setReference(json.data.reference);
      setStatus("success");
      onSuccess?.();
    } catch {
      setServerError("Network error — please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 className="text-brand-success" size={40} />
        <h3 className="text-lg font-semibold text-brand-navy">Inquiry received</h3>
        <p className="text-sm text-foreground/60">
          Reference <span className="font-mono font-semibold">{reference}</span> — our team will
          confirm availability for the {vehicle.name} shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full name" error={errors.customerName}>
          <input
            value={form.customerName}
            onChange={(e) => update("customerName", e.target.value)}
            className={inputClass(errors.customerName)}
            placeholder="Jordan Smith"
          />
        </Field>
        <Field label="Email" error={errors.customerEmail}>
          <input
            type="email"
            value={form.customerEmail}
            onChange={(e) => update("customerEmail", e.target.value)}
            className={inputClass(errors.customerEmail)}
            placeholder="jordan@example.com"
          />
        </Field>
      </div>

      <Field label="Phone number" error={errors.customerPhone}>
        <input
          value={form.customerPhone}
          onChange={(e) => update("customerPhone", e.target.value)}
          className={inputClass(errors.customerPhone)}
          placeholder="+44 7700 900000"
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Pick-up location" error={errors.pickupLocation}>
          <input
            value={form.pickupLocation}
            onChange={(e) => update("pickupLocation", e.target.value)}
            className={inputClass(errors.pickupLocation)}
            placeholder="London Heathrow"
          />
        </Field>
        <Field label="Drop-off location" error={errors.dropoffLocation}>
          <input
            value={form.dropoffLocation}
            onChange={(e) => update("dropoffLocation", e.target.value)}
            className={inputClass(errors.dropoffLocation)}
            placeholder="London Heathrow"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Pick-up date" error={errors.pickupDate}>
          <input
            type="date"
            value={form.pickupDate}
            onChange={(e) => update("pickupDate", e.target.value)}
            className={inputClass(errors.pickupDate)}
          />
        </Field>
        <Field label="Drop-off date" error={errors.dropoffDate}>
          <input
            type="date"
            value={form.dropoffDate}
            onChange={(e) => update("dropoffDate", e.target.value)}
            className={inputClass(errors.dropoffDate)}
          />
        </Field>
      </div>

      <Field label="Anything we should know? (optional)">
        <textarea
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          rows={2}
          className={inputClass()}
          placeholder="E.g. need a child seat, arriving on a late flight…"
        />
      </Field>

      {status === "error" && serverError && (
        <div className="flex items-center gap-2 rounded-lg bg-brand-danger-bg px-3 py-2 text-sm text-brand-danger">
          <AlertCircle size={16} /> {serverError}
        </div>
      )}

      <Button type="submit" size="lg" disabled={status === "loading"} className="mt-2">
        {status === "loading" && <Loader2 size={16} className="animate-spin" />}
        {status === "loading" ? "Submitting…" : "Request this car"}
      </Button>
    </form>
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
