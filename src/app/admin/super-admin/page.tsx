"use client";

import { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Check } from "lucide-react";

const ROLES = ["Owner", "Manager", "Staff", "Support"] as const;
const PERMISSIONS = [
  "View dashboard",
  "Manage inventory",
  "Manage bookings",
  "Process refunds",
  "Manage campaigns",
  "Manage users",
];

const defaultMatrix: Record<(typeof ROLES)[number], Record<string, boolean>> = {
  Owner: Object.fromEntries(PERMISSIONS.map((p) => [p, true])) as Record<string, boolean>,
  Manager: Object.fromEntries(
    PERMISSIONS.map((p) => [p, p !== "Manage users"]),
  ) as Record<string, boolean>,
  Staff: Object.fromEntries(
    PERMISSIONS.map((p) => [p, ["View dashboard", "Manage bookings"].includes(p)]),
  ) as Record<string, boolean>,
  Support: Object.fromEntries(
    PERMISSIONS.map((p) => [p, p === "View dashboard"]),
  ) as Record<string, boolean>,
};

export default function SuperAdminPage() {
  const [matrix, setMatrix] = useState(defaultMatrix);

  function toggle(role: (typeof ROLES)[number], permission: string) {
    setMatrix((m) => ({
      ...m,
      [role]: { ...m[role], [permission]: !m[role][permission] },
    }));
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Super Admin"
        subtitle="Role-based permissions — click a cell to grant or revoke access."
      />

      <div className="overflow-x-auto rounded-2xl border border-surface-border bg-white">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b border-surface-border">
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-foreground/40">
                Permission
              </th>
              {ROLES.map((r) => (
                <th key={r} className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-foreground/40">
                  {r}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {PERMISSIONS.map((permission) => (
              <tr key={permission}>
                <td className="px-5 py-3 font-medium text-brand-navy">{permission}</td>
                {ROLES.map((role) => (
                  <td key={role} className="px-5 py-3 text-center">
                    <button
                      onClick={() => toggle(role, permission)}
                      aria-pressed={matrix[role][permission]}
                      aria-label={`${matrix[role][permission] ? "Revoke" : "Grant"} ${permission} for ${role}`}
                      className={`mx-auto flex h-6 w-6 items-center justify-center rounded-md border transition-colors ${
                        matrix[role][permission]
                          ? "border-brand-success bg-brand-success-bg text-brand-success"
                          : "border-surface-border text-transparent hover:border-brand-navy/30"
                      }`}
                    >
                      <Check size={14} />
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
