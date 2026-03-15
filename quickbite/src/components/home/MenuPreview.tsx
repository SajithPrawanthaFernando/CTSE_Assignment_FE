"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const FEATURED_ITEMS = [
  {
    id: 1,
    name: "Gourmet Burgers",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600",
    color: "bg-orange-50",
  },
  {
    id: 2,
    name: "Artisan Pizzas",
    img: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=600",
    color: "bg-red-50",
  },
  {
    id: 3,
    name: "Fresh Salads",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600",
    color: "bg-green-50",
  },
  {
    id: 4,
    name: "Italian Pastas",
    img: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=600",
    color: "bg-yellow-50",
  },
  {
    id: 5,
    name: "Signature Drinks",
    img: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=600",
    color: "bg-blue-50",
  },
];

export const MenuPreview = () => {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const pin = gsap.fromTo(
      sectionRef.current,
      { translateX: 0 },
      {
        translateX: "-150vw",
        ease: "none",
        duration: 1,
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "2000 top",
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
        },
      },
    );
    return () => {
      pin.kill();
    };
  }, []);

  return (
    <div className="overflow-hidden bg-white">
      <div ref={triggerRef}>
        <div
          ref={sectionRef}
          className="relative flex flex-row w-[300vw] h-screen items-center px-[10vw] gap-20"
        >
          {/* Intro Slide */}
          <div className="w-[60vw] flex flex-col justify-center shrink-0">
            <h2 className="text-7xl font-black text-gray-900 leading-tight">
              Explore Our <br />
              <span className="text-orange-600 underline decoration-gray-200">
                Signature
              </span>{" "}
              Menu
            </h2>
            <p className="mt-6 text-xl text-gray-500 max-w-md">
              Swipe through our top-rated categories. Each dish is crafted with
              locally sourced ingredients.
            </p>
            <div className="mt-10 flex items-center gap-4 text-orange-600 font-bold uppercase tracking-widest text-sm">
              <span>Scroll Down to Explore</span>
              <div className="w-20 h-[2px] bg-orange-600" />
            </div>
          </div>

          {/* Featured Cards */}
          {FEATURED_ITEMS.map((item) => (
            <div
              key={item.id}
              className={`relative w-[450px] h-[550px] ${item.color} rounded-[3rem] p-10 shrink-0 group overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-500`}
            >
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <span className="text-xs font-black tracking-widest uppercase text-gray-400">
                    Featured Category
                  </span>
                  <h3 className="text-4xl font-black text-gray-900 mt-2">
                    {item.name}
                  </h3>
                </div>
                <Link
                  href="/menu"
                  className="w-14 h-14 bg-white rounded-full flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all duration-300"
                >
                  <ArrowRight />
                </Link>
              </div>

              <div className="absolute bottom-0 right-0 w-[80%] h-[60%]">
                <Image
                  src={item.img}
                  alt={item.name}
                  fill
                  className="object-cover rounded-tl-[4rem] group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          ))}

          {/* Outro Slide */}
          <div className="w-[60vw] flex flex-col items-center justify-center shrink-0">
            <div className="text-center space-y-6">
              <h3 className="text-5xl font-black">Hungry yet?</h3>
              <Link
                href="/menu"
                className="inline-block bg-orange-600 text-white px-12 py-5 rounded-3xl font-bold text-xl hover:bg-gray-900 transition-colors shadow-2xl shadow-orange-200"
              >
                View Full Menu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
