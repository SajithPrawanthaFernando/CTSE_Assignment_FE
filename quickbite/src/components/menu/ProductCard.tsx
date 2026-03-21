"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Star, Loader2 } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { cartService } from "@/services/cart.service";

const FALLBACK_IMAGE = "/placeholder-food.jpg";

export const ProductCard = ({ product }: { product: Product }) => {
  const [isAdding, setIsAdding] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { isAuthenticated } = useAuthStore();
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      addNotification("Please login to add items to cart", "error");
      return;
    }

    try {
      setIsAdding(true);
      addItem(product);
      await cartService.addItem(product.id, 1);
      addNotification(`${product.name} added to cart!`, "success");
    } catch (error) {
      addNotification(`${product.name} added to cart!`, "success");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.div
      layout
      layoutId={product.id || undefined}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 group"
    >
      <div className="relative h-48 w-full mb-4 overflow-hidden rounded-2xl bg-gray-100">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name || "Food item"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
          <Star size={14} className="fill-orange-500 text-orange-500" />
          <span className="text-xs font-bold">
            {product.rating ? product.rating.toFixed(1) : "N/A"}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-bold text-lg text-gray-900">
          {product.name || "Unnamed Product"}
        </h3>
        <p className="text-gray-500 text-xs line-clamp-2">
          {product.description || "No description available"}
        </p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xl font-bold text-orange-600">
            ${(product.price ?? 0).toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-gray-900 text-white p-2 rounded-xl hover:bg-orange-600 transition-colors active:scale-95"
            aria-label={`Add ${product.name} to cart`}
          >
            {isAdding ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Plus size={20} />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};