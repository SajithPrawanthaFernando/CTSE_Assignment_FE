"use client";

import { useState, useEffect, useRef } from "react";
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
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { notificationService, NotificationData } from "@/services/notification.service";
import { useNotificationStore } from "@/store/useNotificationStore"; // <-- Imported your store

const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} mins ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const previousNotifsRef = useRef<NotificationData[]>([]);
  
  const { addNotification, addConfirmation } = useNotificationStore();

  useEffect(() => {
    // Initial fetch
    fetchNotifications(true);

    const intervalId = setInterval(() => {
      fetchNotifications(false);
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchNotifications = async (showInitialLoader = false) => {
    if (showInitialLoader) setIsLoading(true);
    
    try {
      const data = await notificationService.getNotifications();
      
      if (previousNotifsRef.current.length > 0) {
        const newItems = data.filter(
          (newItem) => !previousNotifsRef.current.some((oldItem) => oldItem._id === newItem._id)
        );

        newItems.forEach((notif) => {
          const type = notif.type.toUpperCase() === 'ORDER' ? 'success' : 'info';
          addNotification(notif.title, type as any); 
        });
      }

      setNotifications(data);
      previousNotifsRef.current = data; // Update our reference for the next poll
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      if (showInitialLoader) setIsLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      addNotification("All notifications marked as read", "success");
    } catch (error) {
      addNotification("Failed to mark notifications as read", "error");
    }
  };

  const deleteNotif = async (id: string, title: string) => {
    // Using your custom confirmation toast (like in the cart page)
    addConfirmation(
      `Delete notification "${title}"?`,
      async () => {
        try {
          await notificationService.deleteNotification(id);
          setNotifications(prev => prev.filter((n) => n._id !== id));
          addNotification("Notification deleted", "info");
        } catch (error) {
          addNotification("Failed to delete notification", "error");
        }
      }
    );
  };

  const getIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case "ORDER":
        return <ShoppingBag className="text-orange-600" size={20} />;
      case "PROMO":
        return <Zap className="text-yellow-600" size={20} />;
      case "PAYMENT":
      default:
        return <Info className="text-blue-600" size={20} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-orange-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
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

          {notifications.some(n => !n.isRead) && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors px-4 py-2 bg-orange-50 rounded-xl"
            >
              <CheckCheck size={18} />
              Mark all as read
            </button>
          )}
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {notifications.length > 0 ? (
              notifications.map((n, index) => (
                <motion.div
                  key={n._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "group relative flex items-start gap-4 p-6 rounded-[2rem] border transition-all cursor-pointer shadow-sm",
                    n.isRead 
                      ? "bg-white border-gray-100"
                      : "bg-white border-orange-200 ring-1 ring-orange-100",
                  )}
                >
                  {!n.isRead && (
                    <span className="absolute top-6 left-2 w-2 h-2 bg-orange-600 rounded-full" />
                  )}

                  <div
                    className={cn(
                      "p-4 rounded-2xl flex-shrink-0",
                      n.type?.toUpperCase() === "ORDER"
                        ? "bg-orange-50"
                        : n.type?.toUpperCase() === "PROMO"
                          ? "bg-yellow-50"
                          : "bg-blue-50",
                    )}
                  >
                    {getIcon(n.type)}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3
                        className={cn(
                          "font-bold text-lg",
                          n.isRead ? "text-gray-700" : "text-gray-900",
                        )}
                      >
                        {n.title}
                      </h3>
                      <span className="text-xs font-medium text-gray-400">
                        {timeAgo(n.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-md">
                      {n.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        deleteNotif(n._id, n.title); // <-- Updated to pass title for the confirmation toast
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