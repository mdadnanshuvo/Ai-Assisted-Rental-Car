"use client";

import { useState } from "react";
import { ChevronDown, TrendingUp } from "lucide-react";
import { RegionSales } from "@/types";

const RANGES = ["This Week", "This Month", "This Year"];

// Rough, stylized continent silhouettes (not geographically precise) laid out
// on a 300x160 viewBox, matching the blob-map illustration style in the Figma.
const continents = [
  { id: "north-america", d: "M20 30 Q35 10 60 20 Q75 35 65 55 Q50 70 35 60 Q15 55 20 30Z", region: "North America" },
  { id: "south-america", d: "M55 75 Q68 72 70 95 Q68 120 55 130 Q45 115 48 95 Q48 82 55 75Z", region: "South America" },
  { id: "europe", d: "M140 20 Q155 12 165 22 Q162 35 150 38 Q138 32 140 20Z", region: "Europe" },
  { id: "africa", d: "M140 45 Q160 42 168 65 Q170 95 155 115 Q140 110 135 85 Q132 62 140 45Z", region: "Africa" },
  { id: "asia", d: "M175 20 Q220 10 245 35 Q240 60 210 60 Q180 55 175 35 Q173 27 175 20Z", region: "Asia" },
  { id: "oceania", d: "M225 100 Q245 95 255 108 Q250 122 232 120 Q222 112 225 100Z", region: "Oceania" },
];

export function SalesByCountries({ regions }: { regions: RegionSales[] }) {
  const [range, setRange] = useState(RANGES[0]);
  const highlighted = regions.find((r) => r.highlighted) ?? regions[0];
  const top = [...regions].sort((a, b) => b.sales - a.sales).slice(0, 4);

  return (
    <div className="rounded-2xl border border-surface-border bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-brand-navy">Sales by Countries</h3>
        <div className="relative">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="appearance-none rounded-lg border border-surface-border py-1.5 pl-3 pr-7 text-sm text-foreground/70 outline-none"
            aria-label="Sales range"
          >
            {RANGES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-foreground/40" />
        </div>
      </div>

      <div className="relative mt-4">
        <svg viewBox="0 0 300 160" className="w-full" role="img" aria-label="Simplified world map showing sales by region">
          {continents.map((c) => (
            <path
              key={c.id}
              d={c.d}
              className={
                c.region === highlighted.region
                  ? "fill-brand-orange"
                  : "fill-surface-muted"
              }
              stroke="white"
              strokeWidth={1}
            />
          ))}
        </svg>

        <div className="absolute left-1/2 top-2 -translate-x-1/2 rounded-lg bg-brand-navy px-3 py-1.5 text-center text-white shadow-lg">
          <p className="text-xs font-semibold">{highlighted.region}</p>
          <p className="text-[11px] text-white/70">{highlighted.sales.toLocaleString()} Sales</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2.5">
        {top.map((r) => (
          <div key={r.region} className="flex items-center gap-3">
            <span className="w-24 shrink-0 truncate text-xs text-foreground/60">{r.region}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-brand-orange"
                style={{ width: `${(r.sales / top[0].sales) * 100}%` }}
              />
            </div>
            <span className="w-10 shrink-0 text-right text-xs font-medium text-brand-navy">
              {(r.sales / 1000).toFixed(1)}k
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-brand-success">
        <TrendingUp size={13} /> 48% increase compare to last week
      </p>
    </div>
  );
}
