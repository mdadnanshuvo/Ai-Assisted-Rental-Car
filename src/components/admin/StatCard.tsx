import { RotateCw, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  variant?: "default" | "orange" | "navy";
  label: string;
  value: string;
  changePct?: number;
  icon?: React.ReactNode;
}

export function StatCard({ variant = "default", label, value, changePct, icon }: StatCardProps) {
  const styles = {
    default: "bg-white text-brand-navy border border-surface-border",
    orange: "bg-brand-orange text-white",
    navy: "bg-brand-navy text-white",
  }[variant];

  const subtleText = {
    default: "text-foreground/50",
    orange: "text-white/80",
    navy: "text-white/70",
  }[variant];

  return (
    <div className={cn("relative flex items-center justify-between overflow-hidden rounded-2xl p-5", styles)}>
      <div>
        <p className={cn("text-sm font-medium", variant === "default" ? "text-brand-orange-dark" : subtleText)}>
          {label}
        </p>
        <p className="mt-2 text-2xl font-bold sm:text-3xl">{value}</p>
        {typeof changePct === "number" && (
          <p className={cn("mt-2 flex items-center gap-1 text-xs font-medium", variant === "default" ? "text-brand-success" : "text-white/90")}>
            <TrendingUp size={13} /> {changePct}% increase compare to last week
          </p>
        )}
      </div>
      {icon ? (
        <div className="shrink-0">{icon}</div>
      ) : (
        <button
          className={cn(
            "absolute right-4 top-4 rounded-full p-1.5",
            variant === "default" ? "text-foreground/30 hover:bg-surface-muted" : "text-white/70 hover:bg-white/10",
          )}
          aria-label="Refresh"
        >
          <RotateCw size={14} />
        </button>
      )}
    </div>
  );
}
