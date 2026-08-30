import { Hero } from "@/components/site/Hero";
import { HowItWorks } from "@/components/site/HowItWorks";
import { VehicleGrid } from "@/components/site/VehicleGrid";
import { WhyChooseUs } from "@/components/site/WhyChooseUs";
import { PromoBanner } from "@/components/site/PromoBanner";
import { Testimonials } from "@/components/site/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <VehicleGrid />
      <WhyChooseUs />
      <PromoBanner />
      <Testimonials />
    </>
  );
}
