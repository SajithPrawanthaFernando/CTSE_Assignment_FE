"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { UtensilsCrossed } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export const ChefsSpecial = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect on the background image
      gsap.to(imageRef.current, {
        yPercent: 20, // Moves the image slower than the scroll
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Fade-in effect for the content card
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 100,
        duration: 1,
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 90%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[80vh] flex items-center justify-center overflow-hidden my-20"
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 w-full h-[120%] -z-10">
        <div ref={imageRef} className="relative w-full h-full">
          <Image
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1920"
            alt="Chef's Special Dish"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
      </div>

      {/* Floating Content Card */}
      <div
        ref={contentRef}
        className="relative z-10 bg-white/95 backdrop-blur-md p-8 md:p-12 rounded-[3rem] shadow-2xl max-w-2xl mx-6 text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 text-white rounded-2xl mb-6 shadow-lg shadow-orange-200">
          <UtensilsCrossed size={32} />
        </div>

        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-orange-600 mb-4">
          Weekly Signature
        </h2>

        <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
          The Midnight <br /> Wagyu Truffle Burger
        </h3>

        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          Experience our chef's masterpiece: A-grade Wagyu beef, shaved black
          truffles, and caramelized shallots on a toasted brioche bun. Available
          this week only.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/menu"
            className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all active:scale-95"
          >
            Order Now - $24.99
          </Link>
          <span className="text-sm font-bold text-gray-400">
            Limited Quantities Available
          </span>
        </div>
      </div>
    </section>
  );
};
