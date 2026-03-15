"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Utensils, Zap, Leaf, Award } from "lucide-react";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    icon: <Zap />,
    title: "30 Min Delivery",
    desc: "If we're late, the meal is on us. Fast and reliable.",
  },
  {
    icon: <Leaf />,
    title: "Fresh Ingredients",
    desc: "Sourced daily from local organic farmers in Sri Lanka.",
  },
  {
    icon: <Utensils />,
    title: "Best Chefs",
    desc: "Expertly crafted meals by world-renowned culinary artists.",
  },
  {
    icon: <Award />,
    title: "Top Quality",
    desc: "Consistently rated #1 for taste and hygiene in Colombo.",
  },
];

export const Features = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Ensure all previous ScrollTriggers (like MenuPreview) are loaded
      ScrollTrigger.refresh();

      const cards = gsap.utils.toArray(".feature-card");

      gsap.from(cards, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%", // Triggers when the top of the section hits 85% of viewport height
          toggleActions: "play none none none",
        },
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      });
    },
    { scope: containerRef },
  ); // Scope limits selection to this component

  return (
    <section ref={containerRef} className="py-24 bg-gray-50 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900">
            Why GustoBistro?
          </h2>
          <p className="text-gray-500 mt-4 text-lg">
            We don't just deliver food; we deliver an experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className=" bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 group border border-transparent hover:border-orange-100"
            >
              <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
