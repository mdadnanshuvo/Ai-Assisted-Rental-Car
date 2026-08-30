import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function PromoBanner() {
  return (
    <section className="bg-surface-muted py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:px-8">
        <div className="relative h-72 overflow-hidden rounded-3xl bg-brand-navy">
          <Image
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop"
            alt="Exclusive sports car available to rent"
            fill
            className="object-cover opacity-80"
            sizes="(min-width: 640px) 45vw, 100vw"
          />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/10 to-transparent p-8">
            <p className="text-sm font-medium text-white/70">Limited fleet</p>
            <h3 className="mt-1 text-2xl font-bold text-white">Drive an exclusive car this weekend</h3>
            <Link href="/vehicles?type=Exclusive%20Car" className="mt-4 w-fit">
              <Button variant="secondary" size="sm">
                Explore exclusive cars
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative h-72 overflow-hidden rounded-3xl bg-brand-orange">
          <Image
            src="https://images.unsplash.com/photo-1617469767053-d3b523a0b982?q=80&w=1200&auto=format&fit=crop"
            alt="Electric vehicle charging"
            fill
            className="object-cover opacity-80 mix-blend-multiply"
            sizes="(min-width: 640px) 45vw, 100vw"
          />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-black/10 to-transparent p-8">
            <p className="text-sm font-medium text-white/80">New arrivals</p>
            <h3 className="mt-1 text-2xl font-bold text-white">Go electric — save on every mile</h3>
            <Link href="/vehicles" className="mt-4 w-fit">
              <Button variant="secondary" size="sm">
                Browse electric &amp; hybrid
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
