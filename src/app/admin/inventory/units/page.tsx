"use client";

import { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { Save, Check } from "lucide-react";

interface Unit {
  id: string;
  label: string;
  multiplier: number;
  description: string;
}

const initialUnits: Unit[] = [
  { id: "day", label: "Day", multiplier: 1, description: "Base daily rate" },
  { id: "week", label: "Week", multiplier: 6.3, description: "10% discount vs 7 daily rates" },
  { id: "month", label: "Month", multiplier: 24, description: "~20% discount vs 30 daily rates" },
];

export default function UnitsPage() {
  const [units, setUnits] = useState(initialUnits);
  const [saved, setSaved] = useState(false);

  function update(id: string, multiplier: number) {
    setUnits((list) => list.map((u) => (u.id === id ? { ...u, multiplier } : u)));
    setSaved(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Units"
        subtitle="Rental duration units and their pricing multipliers, applied on top of the daily rate."
      />

      <div className="max-w-2xl overflow-hidden rounded-2xl border border-surface-border bg-white">
        <div className="hidden grid-cols-[1fr_1fr_2fr] gap-4 border-b border-surface-border px-5 py-3 text-xs font-semibold uppercase tracking-wide text-foreground/40 sm:grid">
          <span>Unit</span>
          <span>Multiplier</span>
          <span>Notes</span>
        </div>
        {units.map((u) => (
          <div
            key={u.id}
            className="grid grid-cols-1 gap-2 border-b border-surface-border px-5 py-3 last:border-0 sm:grid-cols-[1fr_1fr_2fr] sm:items-center sm:gap-4"
          >
            <span className="font-medium text-brand-navy">{u.label}</span>
            <input
              type="number"
              step={0.1}
              min={0.1}
              value={u.multiplier}
              onChange={(e) => update(u.id, parseFloat(e.target.value || "0"))}
              className="w-24 rounded-lg border border-surface-border px-2 py-1.5 text-sm outline-none focus:border-brand-navy"
            />
            <span className="text-xs text-foreground/50">{u.description}</span>
          </div>
        ))}
      </div>

      <Button className="w-fit" onClick={() => setSaved(true)}>
        {saved ? <Check size={16} /> : <Save size={16} />}
        {saved ? "Saved" : "Save changes"}
      </Button>
    </div>
  );
}
