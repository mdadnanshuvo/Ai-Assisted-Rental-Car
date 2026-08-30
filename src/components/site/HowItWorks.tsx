import { MapPin, CalendarDays, Car } from "lucide-react";

const steps = [
  {
    icon: MapPin,
    title: "Choose Location",
    description: "Pick a city or airport near you from our growing UK-wide network.",
  },
  {
    icon: CalendarDays,
    title: "Pick-up Date",
    description: "Tell us when you need the car and for how long — we'll hold the rate.",
  },
  {
    icon: Car,
    title: "Book your car",
    description: "Confirm your details and drive away — no paperwork queues.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-brand-navy sm:text-4xl">How it works</h2>
        <p className="mx-auto mt-3 max-w-lg text-foreground/60">
          A high-performing web-based car rental system for any rent-a-car company and
          website.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-12 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.title} className="flex flex-col items-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-orange-tint text-brand-orange-dark">
                <step.icon size={26} />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-brand-navy">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
