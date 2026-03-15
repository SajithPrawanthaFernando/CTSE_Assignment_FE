"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";

// Mock Testimonials (Ideally use real feedback from your Colombo customers)
const TESTIMONIALS = [
  {
    id: 1,
    name: "Ayesha Perera",
    location: "Colombo 03",
    quote:
      "GustoBistro has completely changed my dinner game! The Midnight Wagyu Truffle Burger is out of this world. Delivery is always under 30 minutes, and the food arrives piping hot.",
    image: "https://i.pravatar.cc/150?img=5",
    rating: 5,
  },
  {
    id: 2,
    name: "Rohan De Silva",
    location: "Dehiwala",
    quote:
      "As a busy professional, I don't have time to cook. GustoBistro offers gourmet meals at great prices. The Artisan Pizzas are my go-to, and the app interface is incredibly user-friendly.",
    image: "https://i.pravatar.cc/150?img=12",
    rating: 4,
  },
  {
    id: 3,
    name: "Dilini Mendis",
    location: "Nugegoda",
    quote:
      "I've tried almost every delivery service in Colombo, and none compare. The Fresh Salads are always crisp, and the Chef's Special never fails to impress. Highly recommended!",
    image: "https://i.pravatar.cc/150?img=3",
    rating: 5,
  },
];

export const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-play the slider
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000); // Change testimonial every 6 seconds

    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setActiveIndex(
      (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length,
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const activeTestimonial = TESTIMONIALS[activeIndex];

  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
        {/* Left Content - Header & Navigation */}
        <div className="space-y-6 lg:col-span-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full font-bold text-sm">
            <Quote size={16} className="rotate-180" />
            Colombo Foodies Speak
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
            Loved by Colombo's <br />{" "}
            <span className="text-orange-600">Finest.</span>
          </h2>

          <p className="text-gray-500 max-w-lg mx-auto lg:mx-0">
            Hear from our satisfied customers who experience gourmet dining,
            fast delivery, and unparalleled service every day.
          </p>

          <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
            <button
              onClick={handlePrev}
              className="p-3 bg-gray-100 rounded-full hover:bg-orange-600 hover:text-white transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="p-3 bg-gray-100 rounded-full hover:bg-orange-600 hover:text-white transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Right Content - Animated Testimonial Card */}
        <div className="lg:col-span-2 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="bg-gray-50 p-10 md:p-16 rounded-[3rem] shadow-sm relative overflow-hidden"
            >
              <Quote
                size={64}
                className="text-orange-100 absolute top-[-10px] right-[-10px]"
              />

              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                {/* User Image */}
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
                  <Image
                    src={activeTestimonial.image}
                    alt={activeTestimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Testimonial Text */}
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < activeTestimonial.rating
                            ? "fill-orange-500 text-orange-500"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>

                  <p className="text-xl md:text-2xl font-medium text-gray-800 leading-relaxed font-serif italic">
                    "{activeTestimonial.quote}"
                  </p>

                  <div>
                    <p className="font-bold text-gray-900">
                      {activeTestimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activeTestimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
