"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/menu/ProductCard";
import { Product } from "@/types";

const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Classic Cheeseburger",
    category: "Burgers",
    price: 12.99,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500",
    description:
      "Juicy beef patty with melted cheddar, lettuce, and our secret sauce.",
  },
  {
    id: "2",
    name: "Margherita Pizza",
    category: "Pizza",
    price: 14.5,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=500",
    description: "Fresh mozzarella, basil, and San Marzano tomato sauce.",
  },
  {
    id: "3",
    name: "Truffle Mushroom Pasta",
    category: "Pasta",
    price: 18.0,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=500",
    description: "Creamy fettuccine with wild mushrooms and white truffle oil.",
  },
  {
    id: "4",
    name: "Iced Caramel Macchiato",
    category: "Beverages",
    price: 5.5,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=500",
    description:
      "Freshly brewed espresso with steamed milk and caramel drizzle.",
  },
];

const categories = ["All", "Burgers", "Pizza", "Pasta", "Beverages"];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts =
    activeCategory === "All"
      ? MOCK_PRODUCTS
      : MOCK_PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    // FIXED: Added pt-28 to clear the fixed header and min-h-screen for background consistency
    <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-gray-900 mb-4"
          >
            Our Delicious Menu
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-2xl mx-auto text-lg"
          >
            Explore our hand-picked selection of gourmet meals, prepared fresh
            every day just for you.
          </motion.p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-orange-600 text-white shadow-xl shadow-orange-200 scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-400 text-xl font-medium">
              No items found in this category.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
