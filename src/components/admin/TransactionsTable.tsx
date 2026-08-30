import Image from "next/image";
import Link from "next/link";
import { Booking } from "@/types";
import { StatusBadge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import { Clock } from "lucide-react";

export function TransactionsTable({ bookings }: { bookings: Booking[] }) {
  return (
    <div className="rounded-2xl border border-surface-border bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-brand-navy">Recent Transactions</h3>
        <Link href="/admin/bookings" className="text-sm font-medium text-foreground/50 hover:text-brand-navy">
          View All
        </Link>
      </div>

      {/* Desktop table */}
      <div className="mt-4 hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-foreground/40">
              <th className="pb-3 pr-4 font-medium">#</th>
              <th className="pb-3 pr-4 font-medium">Order Details</th>
              <th className="pb-3 pr-4 font-medium">Payment</th>
              <th className="pb-3 pr-4 font-medium">Status</th>
              <th className="pb-3 pr-4 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {bookings.map((b, i) => (
              <tr key={b.id}>
                <td className="py-3 pr-4 text-foreground/50">{i + 1}</td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                      <Image src={b.vehicleImage} alt={b.vehicleName} fill className="object-cover" sizes="36px" />
                    </div>
                    <div>
                      <p className="font-medium text-brand-navy">{b.vehicleName}</p>
                      <p className="flex items-center gap-1 text-xs text-foreground/40">
                        <Clock size={11} /> {new Date(b.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <p className="text-foreground/70">{b.payment}</p>
                  <p className="text-xs text-brand-navy/70">{b.reference}</p>
                </td>
                <td className="py-3 pr-4">
                  <StatusBadge status={b.status} />
                </td>
                <td className="py-3 pr-4 text-right font-semibold text-brand-navy">
                  {formatCurrency(b.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="mt-4 flex flex-col gap-3 md:hidden">
        {bookings.map((b) => (
          <div key={b.id} className="rounded-xl border border-surface-border p-3">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                <Image src={b.vehicleImage} alt={b.vehicleName} fill className="object-cover" sizes="40px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-brand-navy">{b.vehicleName}</p>
                <p className="text-xs text-foreground/50">{b.reference}</p>
              </div>
              <StatusBadge status={b.status} />
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-foreground/60">{b.payment}</span>
              <span className="font-semibold text-brand-navy">{formatCurrency(b.amount)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
