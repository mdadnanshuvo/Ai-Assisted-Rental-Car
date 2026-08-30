"use client";

import { useState } from "react";
import { Vehicle } from "@/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { BookingForm } from "@/components/site/BookingForm";
import { ShieldCheck, Clock } from "lucide-react";

export function VehicleDetailActions({ vehicle }: { vehicle: Vehicle }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="h-fit rounded-2xl border border-surface-border p-6 lg:sticky lg:top-24">
        <p className="text-sm text-foreground/50">Estimated total</p>
        <p className="mt-1 text-3xl font-bold text-brand-navy">
          ${vehicle.pricePerDay}
          <span className="text-base font-normal text-foreground/50"> / day</span>
        </p>

        <Button
          size="lg"
          className="mt-5 w-full"
          disabled={!vehicle.available}
          onClick={() => setOpen(true)}
        >
          {vehicle.available ? "Request this car" : "Currently unavailable"}
        </Button>

        <div className="mt-5 space-y-3 text-sm text-foreground/60">
          <p className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-brand-success" /> Free cancellation up to 24h before pick-up
          </p>
          <p className="flex items-center gap-2">
            <Clock size={16} className="text-brand-navy" /> Mileage: {vehicle.mileage}
          </p>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={`Request ${vehicle.name}`}>
        <BookingForm vehicle={vehicle} onSuccess={() => {}} />
      </Modal>
    </>
  );
}
