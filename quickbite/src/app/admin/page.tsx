"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Utensils,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Mock data for initial layout - You can replace this with your real Orders API later
const RECENT_ORDERS = [
  {
    id: "ORD-001",
    customer: "Sajith Fernando",
    items: "2x Cheeseburger, 1x Coke",
    total: 32.5,
    status: "Preparing",
    time: "10 mins ago",
  },
  {
    id: "ORD-002",
    customer: "Emma Ryan",
    items: "1x Truffle Pasta",
    total: 18.0,
    status: "Ready",
    time: "15 mins ago",
  },
  {
    id: "ORD-003",
    customer: "Justin Weber",
    items: "1x Margherita Pizza",
    total: 14.5,
    status: "Delivering",
    time: "22 mins ago",
  },
  {
    id: "ORD-004",
    customer: "Nawala Pitiya",
    items: "3x Iced Macchiato",
    total: 16.5,
    status: "Delivered",
    time: "1 hour ago",
  },
];

const CHART_DATA = [40, 70, 45, 90, 65, 85, 100]; // Mock revenue data

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Future: Fetch top-level stats from your backend here
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6 md:p-10 font-sans text-gray-900">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 max-w-[1400px] mx-auto">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Welcome back. Here is what's happening at GustoBistro today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-gray-200 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 shadow-sm transition-colors">
            Download Report
          </button>
          <button className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 shadow-sm transition-colors">
            View Live Orders
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* ROW 1: TOP METRIC CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Total Revenue */}
          <div className="bg-white p-6 rounded-[24px] shadow-[0_2px_12px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col justify-between h-[160px]">
            <div className="flex items-center gap-3 text-gray-500 font-bold text-sm">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <DollarSign size={18} />
              </div>
              Today's Revenue
            </div>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-black tracking-tighter">
                $1,284.50
              </span>
              <span className="flex items-center gap-1 text-teal-600 bg-teal-50 px-2.5 py-1 rounded-lg text-xs font-bold mb-1">
                <TrendingUp size={14} /> +14.2%
              </span>
            </div>
          </div>

          {/* Active Orders */}
          <div className="bg-white p-6 rounded-[24px] shadow-[0_2px_12px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col justify-between h-[160px]">
            <div className="flex items-center gap-3 text-gray-500 font-bold text-sm">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                <ShoppingBag size={18} />
              </div>
              Active Orders
            </div>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-black tracking-tighter">24</span>
              <span className="text-xs text-gray-400 font-bold mb-1">
                12 pending
              </span>
            </div>
          </div>

          {/* Total Customers */}
          <div className="bg-white p-6 rounded-[24px] shadow-[0_2px_12px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col justify-between h-[160px]">
            <div className="flex items-center gap-3 text-gray-500 font-bold text-sm">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users size={18} />
              </div>
              Total Customers
            </div>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-black tracking-tighter">
                1,293
              </span>
              <span className="flex items-center gap-1 text-teal-600 bg-teal-50 px-2.5 py-1 rounded-lg text-xs font-bold mb-1">
                <TrendingUp size={14} /> +3.1%
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="bg-white p-6 rounded-[24px] shadow-[0_2px_12px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col justify-between h-[160px]">
            <div className="flex items-center gap-3 text-gray-500 font-bold text-sm">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <Utensils size={18} />
              </div>
              Menu Items
            </div>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-black tracking-tighter">86</span>
              <span className="text-xs text-gray-400 font-bold mb-1">
                4 out of stock
              </span>
            </div>
          </div>
        </div>

        {/* ROW 2: CHARTS & ALERTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[24px] shadow-[0_2px_12px_rgb(0,0,0,0.02)] border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold">Revenue Overview</h3>
                <p className="text-gray-400 text-sm font-medium mt-1">
                  Sales performance over the last 7 days
                </p>
              </div>
              <button className="border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-50">
                This Week ▼
              </button>
            </div>

            <div className="h-64 flex items-end justify-between gap-3 relative">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                <div className="border-b border-gray-900 w-full h-0"></div>
                <div className="border-b border-gray-900 w-full h-0"></div>
                <div className="border-b border-gray-900 w-full h-0"></div>
                <div className="border-b border-gray-900 w-full h-0"></div>
              </div>

              {/* Bars */}
              {CHART_DATA.map((height, i) => (
                <div
                  key={i}
                  className="w-full max-w-[4rem] group relative flex flex-col items-center justify-end h-full z-10"
                >
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-1.5 px-3 rounded-lg font-bold">
                    ${(height * 24.5).toFixed(0)}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                  </div>
                  <div
                    style={{ height: `${height}%` }}
                    className={cn(
                      "w-full rounded-t-xl transition-all duration-300 cursor-pointer",
                      height === 100
                        ? "bg-teal-400"
                        : "bg-gray-100 group-hover:bg-gray-200",
                    )}
                  />
                  <span className="text-xs font-bold text-gray-400 mt-4">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions / Alerts */}
          <div className="bg-gray-900 text-white p-8 rounded-[24px] shadow-xl flex flex-col relative overflow-hidden">
            {/* Decorative Background element */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-teal-500 rounded-full blur-[80px] opacity-50 pointer-events-none"></div>

            <h3 className="text-xl font-bold mb-6 relative z-10">
              Needs Attention
            </h3>

            <div className="space-y-4 flex-1 relative z-10">
              <div className="bg-white/10 p-4 rounded-2xl border border-white/5 flex items-start gap-4">
                <div className="p-2 bg-orange-500/20 text-orange-400 rounded-xl">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">3 Orders Delayed</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Exceeding 45min prep time.
                  </p>
                </div>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/5 flex items-start gap-4">
                <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl">
                  <Utensils size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Low Inventory</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Truffle oil is running low.
                  </p>
                </div>
              </div>
            </div>

            <button className="w-full bg-white text-gray-900 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors mt-6 relative z-10">
              Manage Alerts
            </button>
          </div>
        </div>

        {/* ROW 3: RECENT LIVE ORDERS */}
        <div className="bg-white rounded-[24px] shadow-[0_2px_12px_rgb(0,0,0,0.02)] border border-gray-100 overflow-hidden mt-6">
          <div className="p-6 flex items-center justify-between border-b border-gray-50">
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <button className="text-sm font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
              View All <ArrowRight size={16} />
            </button>
          </div>

          <div className="overflow-x-auto p-4">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-400 text-xs font-medium">
                  <th className="px-4 py-2">Order ID</th>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Items</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Time</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map((order) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={order.id}
                    className="group hover:bg-gray-50/50 rounded-xl transition-colors"
                  >
                    <td className="px-4 py-4 rounded-l-xl text-sm font-bold text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-full bg-gray-100 overflow-hidden shrink-0">
                          <Image
                            src={`https://i.pravatar.cc/150?u=${order.customer}`}
                            alt={order.customer}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-bold text-sm text-gray-900">
                          {order.customer}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 font-medium truncate max-w-[200px]">
                      {order.items}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          order.status === "Delivered"
                            ? "bg-teal-100 text-teal-700"
                            : order.status === "Preparing"
                              ? "bg-orange-100 text-orange-700"
                              : order.status === "Ready"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700",
                        )}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-500">
                      {order.time}
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-gray-900">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-right rounded-r-xl">
                      <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
