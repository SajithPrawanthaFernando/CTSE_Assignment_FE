"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OrderDetailsModal } from "@/components/orders/OrderDetailsModal";
import { orderService } from "@/services/order.service";
import { useAuthStore } from "@/store/useAuthStore";

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  //    Fetch orders from backend on mount
  useEffect(() => {
    const fetchOrders = async () => {
      //    Redirect if not logged in
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      try {
        setIsLoading(true);
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (err: any) {
        setError('Failed to load orders. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, router]);

  //    Helper to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  //    Helper to get status color
  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-700';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-700';
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-700';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      case 'PENDING':
      default:
        return 'bg-orange-100 text-orange-700';
    }
  };

  //    Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="h-12 w-48 bg-white rounded-2xl animate-pulse" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white rounded-[2.5rem] animate-pulse shadow-sm" />
          ))}
        </div>
      </div>
    );
  }

  //    Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-500 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-orange-700 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  //    Empty state
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center space-y-8 max-w-md mx-auto text-center"
        >
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-xl shadow-gray-200/50">
            <ShoppingBag size={56} className="text-orange-600" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-gray-900">
              No orders yet
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              You haven't placed any orders yet. Let's find something delicious!
            </p>
          </div>
          <Link
            href="/menu"
            className="bg-orange-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-orange-700 transition-all flex items-center gap-3 shadow-lg shadow-orange-200 active:scale-95"
          >
            Browse Menu
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-black mb-10 text-gray-900"
        >
          Order History
        </motion.h1>

        <div className="space-y-4">
          {orders.map((order, index) => (
            <motion.div
              key={order._id}
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
                    #{order._id.slice(-6).toUpperCase()} {/*    show last 6 chars of ID */}
                  </p>
                  <p className="text-sm text-gray-500 font-medium mt-1">
                    {formatDate(order.createdAt)} • {order.items.length}{" "}
                    {order.items.length > 1 ? "items" : "item"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="font-black text-xl text-gray-900">
                    ${order.totalAmount.toFixed(2)}
                  </p>
                  <div className="mt-1 flex justify-end">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${getStatusStyle(order.status)}`}
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