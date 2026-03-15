"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Star } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { useNotificationStore } from "@/store/useNotificationStore";

export const ProductCard = ({ product }: { product: Product }) => {
  // Hook into our global stores
  const addItem = useCartStore((state) => state.addItem);
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  const handleAddToCart = () => {
    addItem(product);
    // Trigger the notification system we built
    addNotification(`${product.name} added to cart!`, "success");
  };

  return (
    <motion.div
      layout
      layoutId={product.id} // Ensures smooth movement when filtering categories
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 group"
    >
      <div className="relative h-48 w-full mb-4 overflow-hidden rounded-2xl">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
          <Star size={14} className="fill-orange-500 text-orange-500" />
          <span className="text-xs font-bold">{product.rating}</span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
        <p className="text-gray-500 text-xs line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xl font-bold text-orange-600">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-gray-900 text-white p-2 rounded-xl hover:bg-orange-600 transition-colors active:scale-95"
            aria-label="Add to cart"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
