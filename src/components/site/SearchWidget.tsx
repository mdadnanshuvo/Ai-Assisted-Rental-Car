"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MapPin, Calendar, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

const locations = ["London", "Manchester", "Bristol", "Leeds"];

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 min-w-[140px]">
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-brand-navy">
        {label}
      </label>
      <div className="flex items-center gap-2 text-foreground/60">
        {icon}
        {children}
      </div>
    </div>
  );
}

export function SearchWidget({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [date, setDate] = useState("");

  function handleSearch() {
    const params = new URLSearchParams();
    if (pickup) params.set("location", pickup);
    if (date) params.set("date", date);
    router.push(`/vehicles?${params.toString()}`);
  }

  return (
    <div
      className={`rounded-2xl border border-surface-border bg-white p-5 shadow-xl shadow-brand-navy/5 sm:p-6 ${className}`}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:flex-wrap">
          <Field icon={<MapPin size={16} />} label="○ Pick - Up">
            <select
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground outline-none"
              aria-label="Pick-up location"
            >
              <option value="">Select your city</option>
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </Field>
          <Field icon={<Calendar size={16} />} label="Date">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground outline-none"
              aria-label="Pick-up date"
            />
          </Field>
          <Field icon={<Clock size={16} />} label="Time">
            <input
              type="time"
              defaultValue="10:00"
              className="w-full bg-transparent text-sm text-foreground outline-none"
              aria-label="Pick-up time"
            />
          </Field>
        </div>

        <div className="hidden w-px self-stretch bg-surface-border lg:block" />

        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:flex-wrap">
          <Field icon={<MapPin size={16} />} label="○ Drop - Off">
            <select
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground outline-none"
              aria-label="Drop-off location"
            >
              <option value="">Select your city</option>
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </Field>
          <Field icon={<Calendar size={16} />} label="Date">
            <input
              type="date"
              className="w-full bg-transparent text-sm text-foreground outline-none"
              aria-label="Drop-off date"
            />
          </Field>
          <Field icon={<Clock size={16} />} label="Time">
            <input
              type="time"
              defaultValue="10:00"
              className="w-full bg-transparent text-sm text-foreground outline-none"
              aria-label="Drop-off time"
            />
          </Field>
        </div>

        <Button size="lg" className="w-full lg:w-auto" onClick={handleSearch}>
          <Search size={18} />
          Search
        </Button>
      </div>
    </div>
  );
}
