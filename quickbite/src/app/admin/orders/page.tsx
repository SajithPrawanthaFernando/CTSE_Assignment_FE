"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search, Loader2, Trash2,
  ChevronDown, RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { adminService } from "@/services/admin.service";
import { useNotificationStore } from "@/store/useNotificationStore";

const ORDER_STATUSES = [
  'PENDING', 'CONFIRMED', 'PROCESSING',
  'SHIPPED', 'DELIVERED', 'CANCELLED'
];

const getStatusStyle = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'DELIVERED':  return 'bg-teal-100 text-teal-700';
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
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);

  // ← Updated: added addConfirmation
  const { addNotification, addConfirmation } = useNotificationStore();

  useEffect(() => {
    fetchOrders();
  }, []);

  // ← Filter orders when search or status changes
  useEffect(() => {
    let result = orders;

    if (statusFilter !== 'ALL') {
      result = result.filter(o => o.status === statusFilter);
    }

    if (searchQuery.trim()) {
      result = result.filter(o =>
        o._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.userId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredOrders(result);
  }, [orders, statusFilter, searchQuery]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getAllOrders();
      setOrders(data);
    } catch (err) {
      addNotification('Failed to load orders', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // ← Update order status
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);
      await adminService.updateOrderStatus(orderId, newStatus);

      // ← Update local state
      setOrders(prev =>
        prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o)
      );
      addNotification(`Order status updated to ${newStatus}`, 'success');
    } catch (err) {
      addNotification('Failed to update order status', 'error');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // ← Delete order — uses confirmation toast same as cart page
  const handleDeleteOrder = (orderId: string) => {
    addConfirmation(
      `Are you sure you want to delete order #${orderId.slice(-6).toUpperCase()}?`,
      // ← onConfirm: Yes, Remove clicked
      async () => {
        try {
          setDeletingOrderId(orderId);
          await adminService.deleteOrder(orderId);

          // ← Remove from local state
          setOrders(prev => prev.filter(o => o._id !== orderId));
          addNotification('Order deleted successfully', 'success');
        } catch (err) {
          addNotification('Failed to delete order', 'error');
        } finally {
          setDeletingOrderId(null);
        }
      },
      // ← onCancel: Cancel clicked — do nothing
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6 md:p-10">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Orders Management
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              {filteredOrders.length} orders found
            </p>
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-[20px] border border-gray-100 mb-6 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID or user ID..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 px-4 py-3 pr-10 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
            >
              <option value="ALL">All Status</option>
              {ORDER_STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-orange-600" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 font-medium">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-0">
                <thead>
                  <tr className="text-gray-400 text-xs font-medium border-b border-gray-100">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">User ID</th>
                    <th className="px-6 py-4">Items</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      {/* Order ID */}
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>

                      {/* User ID */}
                      <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                        {order.userId.slice(-8)}...
                      </td>

                      {/* Items */}
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>

                      {/* Status Dropdown — Admin can change */}
                      <td className="px-6 py-4">
                        <div className="relative">
                          {updatingOrderId === order._id ? (
                            <Loader2 size={16} className="animate-spin text-orange-600" />
                          ) : (
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                              className={cn(
                                "text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500",
                                getStatusStyle(order.status)
                              )}
                            >
                              {ORDER_STATUSES.map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          disabled={deletingOrderId === order._id}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deletingOrderId === order._id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}