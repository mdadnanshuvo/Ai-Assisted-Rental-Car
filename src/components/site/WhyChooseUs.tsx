import Image from "next/image";
import { Headset, Tag, MapPinned } from "lucide-react";

const points = [
  {
    icon: Headset,
    title: "Customer Support",
    description: "Extremely responsive customer support provided by the team at Best Auto UK.",
  },
  {
    icon: Tag,
    title: "Best Price Guaranteed",
    description: "Extremely best prices for all categories, updated daily against the market.",
  },
  {
    icon: MapPinned,
    title: "Many Locations",
    description: "Available near the big cities across the UK — just visit Best Auto.",
  },
];

export function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-brand-navy sm:text-4xl">Why choose us</h2>
          <p className="mx-auto mt-3 max-w-lg text-foreground/60">
            A high-performing web-based car rental system for any rent-a-car company and
            website.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div className="relative h-72 overflow-hidden rounded-3xl bg-brand-navy sm:h-96">
            <Image
              src="https://images.unsplash.com/photo-1583267746897-2cf415887172?q=80&w=1200&auto=format&fit=crop"
              alt="Rental car handover between agent and customer"
              fill
              className="object-cover opacity-90"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
          </div>

          <div className="flex flex-col gap-8">
            {points.map((p) => (
              <div key={p.title} className="flex gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-orange-tint text-brand-orange-dark">
                  <p.icon size={22} />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-brand-navy">{p.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/60">
                    {p.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
