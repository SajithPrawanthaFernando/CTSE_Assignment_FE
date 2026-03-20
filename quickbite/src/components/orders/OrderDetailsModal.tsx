"use client";
import { motion } from "framer-motion";
import { X, MapPin, Calendar, CreditCard, Hash, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { productService } from "@/services/product.service"; // ← import

interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  status: string;
  totalAmount: number;
  shippingAddress?: string;
  createdAt: string;
}

interface OrderDetailsProps {
  order: Order;
  onClose: () => void;
}

const getStatusStyle = (status: string) => {
  switch (status.toUpperCase()) {
    case 'DELIVERED':  return 'bg-green-100 text-green-700';
    case 'CONFIRMED':  return 'bg-blue-100 text-blue-700';
    case 'PROCESSING': return 'bg-yellow-100 text-yellow-700';
    case 'SHIPPED':    return 'bg-purple-100 text-purple-700';
    case 'CANCELLED':  return 'bg-red-100 text-red-700';
    case 'PENDING':
    default:           return 'bg-orange-100 text-orange-700';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const OrderDetailsModal = ({ order, onClose }: OrderDetailsProps) => {
  // ← Store product names fetched from backend
  const [productNames, setProductNames] = useState<Record<string, string>>({});
  const [loadingProducts, setLoadingProducts] = useState(true);

  // ← Fetch product names when modal opens
  useEffect(() => {
    const fetchProductNames = async () => {
      try {
        // ← Fetch all unique product IDs in this order
        const uniqueProductIds = [...new Set(order.items.map(item => item.productId))];

        // ← Fetch each product from backend
        const productPromises = uniqueProductIds.map(id =>
          productService.getProductById(id).catch(() => null)
        );

        const products = await Promise.all(productPromises);

        // ← Build productId → name map
        const nameMap: Record<string, string> = {};
        products.forEach((product, index) => {
          if (product) {
            nameMap[uniqueProductIds[index]] = product.name;
          } else {
            // ← Fallback to productId if fetch fails
            nameMap[uniqueProductIds[index]] = uniqueProductIds[index];
          }
        });

        setProductNames(nameMap);
      } catch (error) {
        // ← If fetch fails, use productId as fallback
        const fallbackMap: Record<string, string> = {};
        order.items.forEach(item => {
          fallbackMap[item.productId] = item.productId;
        });
        setProductNames(fallbackMap);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProductNames();
  }, [order]);

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
              <Hash size={14} />
              #{order._id.slice(-6).toUpperCase()}
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
          {/* Status & Date Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-gray-400">Date</p>
              <p className="text-sm font-semibold flex items-center gap-2">
                <Calendar size={14} className="text-orange-600" />
                {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[10px] uppercase font-bold text-gray-400">Status</p>
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${getStatusStyle(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-3">
            <p className="text-[10px] uppercase font-bold text-gray-400">
              Your Items ({order.items.length})
            </p>
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Package size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">
                      {loadingProducts ? (
                        // ← Loading skeleton
                        <span className="inline-block w-24 h-4 bg-gray-200 rounded animate-pulse" />
                      ) : (
                        // ← Real product name from backend
                        productNames[item.productId] || item.productId
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-black">${item.subtotal.toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Delivery & Payment */}
          <div className="space-y-4 pt-4 border-t border-dashed border-gray-200">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-gray-400 mt-1" />
              <div>
                <p className="text-xs font-bold text-gray-900">Delivery Address</p>
                <p className="text-xs text-gray-500">
                  {order.shippingAddress || 'No address provided'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard size={18} className="text-gray-400" />
              <div>
                <p className="text-xs font-bold text-gray-900">Payment Method</p>
                <p className="text-xs text-gray-500">GustoBistro Pay</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Total */}
        <div className="p-6 bg-gray-900 text-white flex justify-between items-center">
          <span className="font-bold opacity-70">Total Paid</span>
          <span className="text-2xl font-black">${order.totalAmount.toFixed(2)}</span>
        </div>
      </motion.div>
    </motion.div>
  );
};
