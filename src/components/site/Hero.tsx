import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SearchWidget } from "./SearchWidget";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface-muted">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 pt-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pt-20">
        <div className="animate-fade-in-up">
          <p className="text-sm font-medium text-brand-orange-dark">
            100% Trusted Car rental platform in the UK
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight text-brand-navy sm:text-5xl lg:text-6xl">
            FAST AND EASY WAY TO RENT A CAR
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-foreground/60">
            Our car rental online booking system is designed to meet the specific needs
            of car rental business owners — book in minutes, drive in hours.
          </p>
          <div className="mt-8 flex items-center gap-6">
            <Link href="/vehicles">
              <Button size="lg">Booking Now</Button>
            </Link>
            <Link
              href="/vehicles"
              className="text-sm font-semibold text-brand-navy underline underline-offset-4"
            >
              See all cars
            </Link>
          </div>
        </div>

        <div className="relative h-64 overflow-hidden rounded-3xl bg-brand-navy sm:h-80 lg:h-[26rem]">
          <Image
            src="https://images.unsplash.com/photo-1494905998402-395d579af36f?q=80&w=1400&auto=format&fit=crop"
            alt="A premium rental car parked in a showroom"
            fill
            priority
            className="object-cover opacity-90"
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 lg:px-8 lg:pb-20">
        <SearchWidget />
      </div>
    </section>
  );
}
