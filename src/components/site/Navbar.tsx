"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Car, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/lib/useCurrentUser";

const links = [
  { href: "/", label: "Home" },
  { href: "/#how-it-works", label: "How it Work" },
  { href: "/vehicles", label: "Rental Details" },
  { href: "/#why-choose-us", label: "Why Choose Us" },
  { href: "/#testimonials", label: "Testimonial" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-surface-border bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-brand-navy">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-navy text-white">
            <Car size={18} />
          </span>
          BestAuto
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-brand-navy"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          {user ? (
            <>
              {user.role === "ADMIN" && (
                <Link href="/admin" className="text-sm font-medium text-foreground/70 hover:text-brand-navy">
                  Admin dashboard
                </Link>
              )}
              <span className="flex items-center gap-1.5 text-sm font-medium text-brand-navy">
                <User size={15} /> {user.name.split(" ")[0]}
              </span>
              <Button variant="secondary" size="md" onClick={logout}>
                <LogOut size={15} /> Log out
              </Button>
            </>
          ) : (
            <>
              <Link href="/register" className="text-sm font-medium text-foreground/70 underline underline-offset-4 hover:text-brand-navy">
                Register
              </Link>
              <Link href="/login">
                <Button variant="navy" size="md">
                  Log In
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-brand-navy lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-surface-border bg-white transition-[max-height] duration-300 lg:hidden",
          open ? "max-h-96" : "max-h-0 border-t-0",
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-3">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-surface-muted"
            >
              {l.label}
            </Link>
          ))}

          {user ? (
            <div className="mt-2 flex flex-col gap-2 px-3">
              {user.role === "ADMIN" && (
                <Link href="/admin" onClick={() => setOpen(false)}>
                  <Button variant="secondary" size="sm" className="w-full">
                    Admin dashboard
                  </Button>
                </Link>
              )}
              <p className="flex items-center gap-1.5 text-sm font-medium text-brand-navy">
                <User size={15} /> {user.name}
              </p>
              <Button variant="navy" size="sm" className="w-full" onClick={logout}>
                <LogOut size={15} /> Log out
              </Button>
            </div>
          ) : (
            <div className="mt-2 flex gap-2 px-3">
              <Link href="/register" onClick={() => setOpen(false)} className="flex-1">
                <Button variant="secondary" size="sm" className="w-full">
                  Register
                </Button>
              </Link>
              <Link href="/login" onClick={() => setOpen(false)} className="flex-1">
                <Button variant="navy" size="sm" className="w-full">
                  Log In
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
