"use client";
import { motion } from "framer-motion";

export const CTA = () => {
  return (
    <section className="py-20 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto bg-gray-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden"
      >
        {/* Decorative background circle */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/20 blur-[100px] rounded-full" />

        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            Ready to taste the <br />{" "}
            <span className="text-orange-500">Extraordinary?</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto mb-10 text-lg">
            Join 10,000+ foodies in Colombo getting daily fresh meals. Sign up
            now and get <span className="text-white font-bold">20% off</span>{" "}
            your first order.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:w-80 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white outline-none focus:border-orange-500 transition-all"
            />
            <button className="w-full sm:w-auto bg-orange-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-orange-700 transition-all active:scale-95">
              Get Started
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
