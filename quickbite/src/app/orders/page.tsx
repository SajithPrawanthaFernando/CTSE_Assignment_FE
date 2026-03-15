"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, ChevronRight } from "lucide-react";
import { OrderDetailsModal } from "@/components/orders/OrderDetailsModal";

const MOCK_ORDERS = [
  {
    id: "#GB-8821",
    date: "March 10, 2026",
    total: 45.5,
    status: "Delivered",
    items: 3,
  },
  {
    id: "#GB-9012",
    date: "March 12, 2026",
    total: 22.0,
    status: "Processing",
    items: 1,
  },
];

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  return (
    // FIXED: Added pt-32 to push content below the header and min-h-screen for background
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-black mb-10 text-gray-900"
        >
          Order History
        </motion.h1>

        <div className="space-y-4">
          {MOCK_ORDERS.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedOrder(order)}
              className="group flex items-center justify-between bg-white p-6 rounded-[2.5rem] border border-gray-100 hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-500/5 transition-all cursor-pointer active:scale-[0.98] shadow-sm"
            >
              <div className="flex items-center gap-5">
                <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                  <Package size={24} />
                </div>
                <div>
                  <p className="font-black text-lg text-gray-900 leading-tight">
                    {order.id}
                  </p>
                  <p className="text-sm text-gray-500 font-medium mt-1">
                    {order.date} • {order.items}{" "}
                    {order.items > 1 ? "items" : "item"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="font-black text-xl text-gray-900">
                    ${order.total.toFixed(2)}
                  </p>
                  <div className="mt-1 flex justify-end">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
                <ChevronRight className="text-gray-300 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal Integration */}
        <AnimatePresence>
          {selectedOrder && (
            <OrderDetailsModal
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
