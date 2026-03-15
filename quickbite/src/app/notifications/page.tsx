"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCheck,
  Trash2,
  ShoppingBag,
  Zap,
  Info,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Mock Data for the Notification Inbox
const MOCK_NOTIFS = [
  {
    id: "1",
    title: "Order Delivered",
    desc: "Your order #GB-8821 has been delivered. Enjoy your meal!",
    time: "2 mins ago",
    type: "order",
    read: false,
  },
  {
    id: "2",
    title: "Flash Sale! 20% Off",
    desc: "Use code GUSTO20 for 20% off on all Burgers today.",
    time: "1 hour ago",
    type: "promo",
    read: false,
  },
  {
    id: "3",
    title: "Payment Successful",
    desc: "We received your payment for order #GB-9012.",
    time: "3 hours ago",
    type: "info",
    read: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFS);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotif = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="text-orange-600" size={20} />;
      case "promo":
        return <Zap className="text-yellow-600" size={20} />;
      default:
        return <Info className="text-blue-600" size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-3 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-4xl font-black text-gray-900">Notifications</h1>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors px-4 py-2 bg-orange-50 rounded-xl"
            >
              <CheckCheck size={18} />
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {notifications.length > 0 ? (
              notifications.map((n, index) => (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "group relative flex items-start gap-4 p-6 rounded-[2rem] border transition-all cursor-pointer shadow-sm",
                    n.read
                      ? "bg-white border-gray-100"
                      : "bg-white border-orange-200 ring-1 ring-orange-100",
                  )}
                >
                  {/* Unread Indicator */}
                  {!n.read && (
                    <span className="absolute top-6 left-2 w-2 h-2 bg-orange-600 rounded-full" />
                  )}

                  {/* Icon Wrapper */}
                  <div
                    className={cn(
                      "p-4 rounded-2xl flex-shrink-0",
                      n.type === "order"
                        ? "bg-orange-50"
                        : n.type === "promo"
                          ? "bg-yellow-50"
                          : "bg-blue-50",
                    )}
                  >
                    {getIcon(n.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3
                        className={cn(
                          "font-bold text-lg",
                          n.read ? "text-gray-700" : "text-gray-900",
                        )}
                      >
                        {n.title}
                      </h3>
                      <span className="text-xs font-medium text-gray-400">
                        {n.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-md">
                      {n.desc}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        deleteNotif(n.id);
                      }}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                    <ChevronRight size={18} className="text-gray-300" />
                  </div>
                </motion.div>
              ))
            ) : (
              // Empty State
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 space-y-4"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell size={32} className="text-gray-300" />
                </div>
                <p className="text-gray-400 font-medium">
                  No notifications yet.
                </p>
                <Link
                  href="/menu"
                  className="text-orange-600 font-bold hover:underline"
                >
                  Go explore our menu
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
