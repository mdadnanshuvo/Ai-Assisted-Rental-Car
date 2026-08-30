"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  ShieldCheck,
  Package,
  PackagePlus,
  PackageX,
  TrendingDown,
  Shapes,
  ListTree,
  Tags,
  Boxes,
  SlidersHorizontal,
  BadgeCheck,
  Barcode,
  QrCode,
  Warehouse,
  ArrowLeftRight,
  ClipboardList,
  Receipt,
  FileText,
  Undo2,
  Monitor,
  Megaphone,
  Car,
  ChevronsLeft,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const groups: NavGroup[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutGrid },
      { label: "Super Admin", href: "/admin/super-admin", icon: ShieldCheck },
    ],
  },
  {
    title: "Inventory",
    items: [
      { label: "Products", href: "/admin/vehicles", icon: Package },
      { label: "Create Product", href: "/admin/vehicles/new", icon: PackagePlus },
      { label: "Expired Products", href: "/admin/inventory/expired", icon: PackageX },
      { label: "Low Stocks", href: "/admin/inventory/low-stock", icon: TrendingDown },
      { label: "Category", href: "/admin/inventory/category", icon: Shapes },
      { label: "Sub Category", href: "/admin/inventory/sub-category", icon: ListTree },
      { label: "Brands", href: "/admin/inventory/brands", icon: Tags },
      { label: "Units", href: "/admin/inventory/units", icon: Boxes },
      { label: "Variant Attributes", href: "/admin/inventory/variants", icon: SlidersHorizontal },
      { label: "Warranties", href: "/admin/inventory/warranties", icon: BadgeCheck },
      { label: "Print Barcode", href: "/admin/inventory/barcode", icon: Barcode },
      { label: "Print QR Code", href: "/admin/inventory/qrcode", icon: QrCode },
    ],
  },
  {
    title: "Stock",
    items: [
      { label: "Manage Stock", href: "/admin/stock/manage", icon: Warehouse },
      { label: "Stock Adjustment", href: "/admin/stock/adjustment", icon: SlidersHorizontal },
      { label: "Stock Transfer", href: "/admin/stock/transfer", icon: ArrowLeftRight },
    ],
  },
  {
    title: "Sales",
    items: [
      { label: "Sales", href: "/admin/bookings", icon: ClipboardList },
      { label: "Invoices", href: "/admin/sales/invoices", icon: Receipt },
      { label: "Sales Return", href: "/admin/sales/return", icon: Undo2 },
      { label: "Quotation", href: "/admin/sales/quotation", icon: FileText },
      { label: "POS", href: "/admin/pos", icon: Monitor },
    ],
  },
  {
    title: "Promo",
    items: [{ label: "Campaigns", href: "/admin/promo", icon: Megaphone }],
  },
];

export function Sidebar({
  mobileOpen,
  onCloseMobile,
}: {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const pathname = usePathname();

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-5">
        <Link href="/admin" className="flex items-center gap-2 text-lg font-bold text-brand-navy">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange text-white">
            <Car size={16} />
          </span>
          3Best
        </Link>
        <button
          className="rounded-lg p-1.5 text-foreground/40 hover:bg-surface-muted lg:block hidden"
          aria-label="Collapse sidebar"
        >
          <ChevronsLeft size={16} />
        </button>
        <button
          className="rounded-lg p-1.5 text-foreground/40 hover:bg-surface-muted lg:hidden"
          onClick={onCloseMobile}
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-6">
        {groups.map((group) => (
          <div key={group.title} className="mt-4 first:mt-0">
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-foreground/35">
              {group.title}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-brand-orange-tint text-brand-orange-dark"
                        : "text-foreground/60 hover:bg-surface-muted hover:text-brand-navy",
                    )}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-surface-border bg-white lg:block">
        {content}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onCloseMobile} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-2xl">{content}</aside>
        </div>
      )}
    </>
  );
}
