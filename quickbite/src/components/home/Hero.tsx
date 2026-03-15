"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ArrowRight, Star, Clock, ShieldCheck } from "lucide-react";

export const Hero = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);
  const badgeRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Initial state: Hidden and slightly moved
      tl.from(".hero-text", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
      })
        .from(
          imageRef.current,
          {
            x: 100,
            opacity: 0,
            scale: 0.8,
            rotate: 15,
            duration: 1.5,
          },
          "-=0.8",
        ) // Starts 0.8s early
        .from(
          ".floating-badge",
          {
            scale: 0,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
          },
          "-=0.5",
        );

      // Floating Infinite Animation for the main image
      gsap.to(imageRef.current, {
        y: 20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, containerRef);

    return () => ctx.revert(); // Clean up on unmount
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative pt-30 min-h-[90vh] flex items-center overflow-hidden bg-white px-6"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div ref={textRef} className="space-y-8 relative z-10">
          <h1 className="hero-text text-6xl md:text-7xl font-black text-gray-900 leading-[1.1]">
            Savor the Best <span className="text-orange-600">Flavors</span> at
            Home.
          </h1>

          <p className="hero-text text-lg text-gray-500 max-w-lg leading-relaxed">
            From sizzling steaks to gourmet burgers, we bring the city's finest
            cuisines straight to your doorstep. Fresh, fast, and full of flavor.
          </p>

          <div className="hero-text flex flex-wrap gap-4">
            <Link
              href="/menu"
              className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-orange-600 transition-all shadow-xl shadow-gray-200 active:scale-95"
            >
              Order Now <ArrowRight size={20} />
            </Link>
            <Link
              href="/menu"
              className="bg-white border border-gray-200 text-gray-900 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all active:scale-95"
            >
              View Menu
            </Link>
          </div>

          <div className="hero-text pt-4 flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Clock className="text-orange-600" size={20} />
              <span className="text-sm font-bold text-gray-600">
                30 min Delivery
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-orange-600" size={20} />
              <span className="text-sm font-bold text-gray-600">
                100% Fresh Food
              </span>
            </div>
          </div>
        </div>

        {/* Right Content - Visuals */}
        <div className="relative">
          {/* Main Image Container */}
          <div
            ref={imageRef}
            className="relative z-10 w-full aspect-square max-w-[500px] mx-auto"
          >
            <div className="absolute inset-0 bg-orange-100 rounded-full scale-90 -z-10 blur-3xl opacity-60" />
            <Image
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800"
              alt="Delicious Healthy Bowl"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Floating Badges */}
          <div className="floating-badge absolute top-10 right-0 bg-white p-4 rounded-2xl shadow-2xl z-20 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              🔥
            </div>
            <div>
              <p className="text-xs font-black">Popular Choice</p>
              <p className="text-[10px] text-gray-400">Salmon Avocado Mix</p>
            </div>
          </div>

          <div className="floating-badge absolute bottom-20 -left-5 bg-white p-4 rounded-2xl shadow-2xl z-20 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden relative"
                >
                  <Image
                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                    alt="user"
                    fill
                  />
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-black">500+ Reviews</p>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={10}
                    className="fill-orange-500 text-orange-500"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-orange-50 rounded-full blur-[100px] opacity-50 -z-10" />
    </section>
  );
};
