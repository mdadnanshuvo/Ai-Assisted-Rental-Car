import { cn } from "@/lib/utils";
import { BookingStatus } from "@/types";

const statusStyles: Record<BookingStatus, string> = {
  Success: "bg-brand-success-bg text-brand-success",
  Pending: "bg-brand-pending-bg text-brand-pending",
  Cancelled: "bg-brand-danger-bg text-brand-danger",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        statusStyles[status],
      )}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: "currentColor" }}
      />
      {status}
    </span>
  );
}

const tierStyles: Record<"Hot" | "Warm" | "Cold", string> = {
  Hot: "bg-brand-danger-bg text-brand-danger",
  Warm: "bg-brand-orange-tint text-brand-orange-dark",
  Cold: "bg-surface-muted text-foreground/60",
};

export function LeadTierBadge({ tier }: { tier: "Hot" | "Warm" | "Cold" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tierStyles[tier],
      )}
    >
      {tier} lead
    </span>
  );
}
