import { Hero } from "@/components/home/Hero";
import { MenuPreview } from "@/components/home/MenuPreview";
import { ChefsSpecial } from "@/components/home/ChefsSpecial";
import { Features } from "@/components/home/Features";
import { Testimonials } from "@/components/home/Testimonials"; // Import Testimonials
import { CTA } from "@/components/home/CTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <MenuPreview />
      {/* Spacer for horizontal scroll pinning */}
      <div className="h-[20vh]" />
      <ChefsSpecial />
      <Features />
      <Testimonials /> {/* Add Testimonials */}
      <CTA />
    </main>
  );
}
