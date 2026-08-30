import Link from "next/link";
import { Car } from "lucide-react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-muted">
      <div className="px-4 py-6 sm:px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold text-brand-navy">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-navy text-white">
            <Car size={18} />
          </span>
          BestAuto
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm rounded-2xl border border-surface-border bg-white p-7 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-brand-navy">{title}</h1>
          <p className="mt-1.5 text-sm text-foreground/60">{subtitle}</p>

          <div className="mt-6">{children}</div>

          <p className="mt-6 text-center text-sm text-foreground/60">{footer}</p>
        </div>
      </div>
    </div>
  );
}
