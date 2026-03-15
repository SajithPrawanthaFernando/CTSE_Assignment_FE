"use client";
import { motion } from "framer-motion";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import Link from "next/link";

export const OrderSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {/* Animated Checkmark Container */}
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.2,
        }}
        className="w-28 h-28 bg-green-50 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-green-100/50"
      >
        <CheckCircle2 size={56} className="text-green-600" />
      </motion.div>

      {/* Success Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        <h2 className="text-4xl font-black text-gray-900">Order Confirmed!</h2>
        <p className="text-gray-500 mb-10 max-w-xs mx-auto text-lg leading-relaxed">
          Your delicious meal is being prepared and will be at your doorstep
          shortly.
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
      >
        {/* Track Order - Primary Action */}
        <Link
          href="/orders"
          className="flex items-center justify-center gap-3 bg-gray-900 text-white px-8 py-5 rounded-2xl font-black text-lg hover:bg-orange-600 transition-all shadow-xl shadow-gray-200 flex-1 active:scale-95"
        >
          <Package size={22} />
          Track Order
        </Link>

        {/* Order More - Secondary Action (Fixed Visibility) */}
        <Link
          href="/menu"
          className="flex items-center justify-center gap-3 bg-white border-2 border-gray-100 text-gray-900 px-8 py-5 rounded-2xl font-black text-lg hover:bg-gray-50 hover:border-gray-200 transition-all flex-1 active:scale-95"
        >
          Order More
          <ArrowRight size={22} className="text-orange-600" />
        </Link>
      </motion.div>
    </div>
  );
};
