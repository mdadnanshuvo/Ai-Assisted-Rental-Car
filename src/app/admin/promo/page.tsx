"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Plus, Trash2, Percent } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  discountPct: number;
  vehicleType: string;
  startDate: string;
  endDate: string;
  active: boolean;
}

const TYPES = ["All", "Small Car", "Large Car", "SUV", "Exclusive Car"];

function defaultEndDate() {
  return new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
}

export default function PromoPage() {
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(() => ({
    name: "",
    discountPct: 10,
    vehicleType: "All",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: defaultEndDate(),
  }));
  const [saving, setSaving] = useState(false);

  function load() {
    fetch("/api/campaigns")
      .then((r) => r.json())
      .then((j) => setCampaigns(j.data))
      .catch(() => setCampaigns([]));
  }

  useEffect(load, []);

  async function createCampaign(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      setShowForm(false);
      setForm({ ...form, name: "" });
      load();
    }
  }

  async function toggleActive(c: Campaign) {
    setCampaigns((list) =>
      list ? list.map((x) => (x.id === c.id ? { ...x, active: !x.active } : x)) : list,
    );
    await fetch(`/api/campaigns/${c.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ active: !c.active }),
    });
  }

  async function remove(id: string) {
    setCampaigns((list) => (list ? list.filter((c) => c.id !== id) : list));
    await fetch(`/api/campaigns/${id}`, { method: "DELETE" });
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Campaigns"
        subtitle="Promotional discounts applied at checkout."
        action={
          <Button size="sm" onClick={() => setShowForm((s) => !s)}>
            <Plus size={15} /> New campaign
          </Button>
        }
      />

      {showForm && (
        <form
          onSubmit={createCampaign}
          className="grid grid-cols-1 gap-4 rounded-2xl border border-surface-border bg-white p-5 sm:grid-cols-2 lg:grid-cols-5"
        >
          <input
            required
            placeholder="Campaign name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-brand-navy"
          />
          <input
            type="number"
            min={1}
            max={90}
            value={form.discountPct}
            onChange={(e) => setForm({ ...form, discountPct: parseInt(e.target.value || "0", 10) })}
            className="rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-brand-navy"
          />
          <select
            value={form.vehicleType}
            onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
            className="rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-brand-navy"
          >
            {TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-brand-navy"
          />
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-brand-navy"
          />
          <Button type="submit" disabled={saving} className="sm:col-span-2 lg:col-span-5">
            {saving ? "Creating…" : "Create campaign"}
          </Button>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-surface-border bg-white">
        {campaigns === null &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="px-5 py-4">
              <Skeleton className="h-12 rounded-xl" />
            </div>
          ))}

        {campaigns?.length === 0 && (
          <div className="py-16 text-center text-foreground/50">No campaigns yet.</div>
        )}

        {campaigns?.map((c) => (
          <div
            key={c.id}
            className="flex flex-col gap-2 border-b border-surface-border px-5 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-brand-navy">{c.name}</p>
              <p className="flex items-center gap-1 text-xs text-foreground/50">
                <Percent size={11} /> {c.discountPct}% off {c.vehicleType} · {c.startDate} → {c.endDate}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleActive(c)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  c.active
                    ? "bg-brand-success-bg text-brand-success"
                    : "bg-surface-muted text-foreground/50"
                }`}
              >
                {c.active ? "Active" : "Paused"}
              </button>
              <button
                onClick={() => remove(c.id)}
                aria-label={`Delete ${c.name}`}
                className="rounded-full p-2 text-foreground/40 hover:bg-brand-danger-bg hover:text-brand-danger"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
