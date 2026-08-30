"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { RevenuePoint } from "@/types";

export function SalesAnalyticsChart({ data }: { data: RevenuePoint[] }) {
  return (
    <div className="rounded-2xl border border-surface-border bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-brand-navy">Sales Analytics</h3>
        <span className="rounded-lg border border-surface-border px-3 py-1.5 text-sm text-foreground/60">
          2023
        </span>
      </div>

      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: -20, right: 10, top: 10 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--brand-orange)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--brand-orange)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--surface-border)" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(11,27,43,0.45)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(11,27,43,0.45)", fontSize: 12 }}
              tickFormatter={(v) => `${v / 1000}k`}
            />
            <Tooltip
              formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid var(--surface-border)",
                fontSize: 13,
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--brand-orange)"
              strokeWidth={2.5}
              fill="url(#revenueFill)"
              dot={{ r: 3, fill: "var(--brand-orange)", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
