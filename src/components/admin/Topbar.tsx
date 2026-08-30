"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, Plus, Monitor, Bell, Mail, Settings, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCurrentUser } from "@/lib/useCurrentUser";

const NOTIFICATIONS = [
  { title: "New AI lead: Finn Walker", detail: "Hot lead — BMW X5, weekend trip", time: "2m ago" },
  { title: "Booking cancelled", detail: "#147784454554 · Toyota Corolla", time: "1h ago" },
  { title: "Low stock alert", detail: "Porsche 911 — 1 unit remaining", time: "3h ago" },
];

export function Topbar({ onOpenMobile }: { onOpenMobile: () => void }) {
  const router = useRouter();
  const { user, logout } = useCurrentUser();
  const [query, setQuery] = useState("");
  const [openPanel, setOpenPanel] = useState<"notifications" | "settings" | null>(null);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/admin/vehicles?search=${encodeURIComponent(query)}`);
  }

  return (
    <header className="relative flex items-center gap-3 border-b border-surface-border bg-white px-4 py-3.5 sm:px-6">
      <button
        className="rounded-lg p-2 text-brand-navy lg:hidden"
        onClick={onOpenMobile}
        aria-label="Open sidebar"
      >
        <Menu size={20} />
      </button>

      <form
        onSubmit={handleSearch}
        className="hidden max-w-xs flex-1 items-center gap-2 rounded-lg border border-surface-border bg-surface-muted px-3 py-2 sm:flex"
      >
        <Search size={16} className="text-foreground/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search vehicles…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-foreground/40"
          aria-label="Search dashboard"
        />
        <kbd className="rounded border border-surface-border bg-white px-1.5 py-0.5 text-[10px] text-foreground/40">
          ⏎
        </kbd>
      </form>

      <div className="ml-auto flex items-center gap-2">
        <Link href="/admin/vehicles/new">
          <Button variant="primary" size="sm" className="hidden sm:inline-flex">
            <Plus size={15} /> Add New
          </Button>
        </Link>
        <Link href="/admin/pos">
          <Button variant="navy" size="sm" className="hidden sm:inline-flex">
            <Monitor size={15} /> POS
          </Button>
        </Link>

        <div className="hidden items-center gap-1 sm:flex">
          <Link
            href="/admin/bookings"
            className="relative rounded-full p-2 text-foreground/50 hover:bg-surface-muted"
            aria-label="Messages"
          >
            <Mail size={17} />
          </Link>
          <button
            className="relative rounded-full p-2 text-foreground/50 hover:bg-surface-muted"
            aria-label="Notifications"
            onClick={() => setOpenPanel((p) => (p === "notifications" ? null : "notifications"))}
          >
            <Bell size={17} />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-brand-danger" />
          </button>
          <button
            className="relative rounded-full p-2 text-foreground/50 hover:bg-surface-muted"
            aria-label="Settings"
            onClick={() => setOpenPanel((p) => (p === "settings" ? null : "settings"))}
          >
            <Settings size={17} />
          </button>
        </div>

        <div className="ml-1 h-9 w-9 overflow-hidden rounded-full bg-brand-navy/10" title={user?.name}>
          <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-brand-navy">
            {initials || "—"}
          </div>
        </div>
      </div>

      {openPanel === "notifications" && (
        <div className="absolute right-4 top-16 z-30 w-80 rounded-2xl border border-surface-border bg-white p-2 shadow-xl sm:right-24">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-foreground/40">
            Notifications
          </p>
          {NOTIFICATIONS.map((n) => (
            <div key={n.title} className="rounded-xl px-3 py-2.5 hover:bg-surface-muted">
              <p className="text-sm font-medium text-brand-navy">{n.title}</p>
              <p className="text-xs text-foreground/50">{n.detail}</p>
              <p className="mt-1 text-[11px] text-foreground/35">{n.time}</p>
            </div>
          ))}
        </div>
      )}

      {openPanel === "settings" && (
        <div className="absolute right-4 top-16 z-30 w-64 rounded-2xl border border-surface-border bg-white p-2 shadow-xl sm:right-16">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-foreground/40">
            {user?.name ?? "Quick settings"}
          </p>
          <Link href="/admin/super-admin" className="block rounded-xl px-3 py-2.5 text-sm text-foreground/70 hover:bg-surface-muted">
            Roles &amp; permissions
          </Link>
          <Link href="/admin/promo" className="block rounded-xl px-3 py-2.5 text-sm text-foreground/70 hover:bg-surface-muted">
            Campaign settings
          </Link>
          <Link href="/" className="block rounded-xl px-3 py-2.5 text-sm text-foreground/70 hover:bg-surface-muted">
            View customer site
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-brand-danger hover:bg-brand-danger-bg"
          >
            <LogOut size={14} /> Log out
          </button>
        </div>
      )}
    </header>
  );
}
