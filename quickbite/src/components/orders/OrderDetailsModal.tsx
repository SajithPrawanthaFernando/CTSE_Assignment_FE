"use client";
import { motion } from "framer-motion";
import { X, MapPin, Calendar, CreditCard, Hash } from "lucide-react";
import Image from "next/image";

interface OrderDetailsProps {
  order: any; // Ideally use a proper 'Order' type
  onClose: () => void;
}

export const OrderDetailsModal = ({ order, onClose }: OrderDetailsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="relative p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-xl font-black text-gray-900">Order Details</h2>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Hash size={14} /> {order.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition-colors shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Status & Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-gray-400">
                Date
              </p>
              <p className="text-sm font-semibold flex items-center gap-2">
                <Calendar size={14} className="text-orange-600" /> {order.date}
              </p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[10px] uppercase font-bold text-gray-400">
                Status
              </p>
              <span className="text-xs font-bold bg-green-100 text-green-600 px-2 py-1 rounded-md">
                {order.status}
              </span>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-3">
            <p className="text-[10px] uppercase font-bold text-gray-400">
              Your Items
            </p>
            {/* Note: In a real app, 'order.items' would be an array of products */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-xl overflow-hidden relative">
                  <Image
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=100"
                    alt="item"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold">Classic Cheeseburger</p>
                  <p className="text-xs text-gray-500">Qty: 2</p>
                </div>
              </div>
              <p className="text-sm font-black">$25.98</p>
            </div>
          </div>

          {/* Delivery & Payment */}
          <div className="space-y-4 pt-4 border-t border-dashed border-gray-200">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-gray-400 mt-1" />
              <div>
                <p className="text-xs font-bold text-gray-900">
                  Delivery Address
                </p>
                <p className="text-xs text-gray-500">
                  123 Colombo St, Western Province, Sri Lanka
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard size={18} className="text-gray-400" />
              <div>
                <p className="text-xs font-bold text-gray-900">
                  Payment Method
                </p>
                <p className="text-xs text-gray-500">Visa •••• 4242</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Total */}
        <div className="p-6 bg-gray-900 text-white flex justify-between items-center">
          <span className="font-bold opacity-70">Total Paid</span>
          <span className="text-2xl font-black">${order.total.toFixed(2)}</span>
        </div>
      </motion.div>
    </motion.div>
  );
};
