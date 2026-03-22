"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  MapPin,
  Phone,
  Camera,
  CreditCard,
  Settings,
  LogOut,
  Award,
  Check,
  X,
  LayoutDashboard,
  Loader2, // Added for loading state
} from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import { useAuth } from "@/store/useAuth";
import { authService } from "@/services/auth.service";
import { useNotificationStore } from "@/store/useNotificationStore";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { user, isAuthenticated, setAuth, token } = useAuthStore();
  const { logout } = useAuth();
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  const isAdmin = user?.roles?.some((role) => role.toLowerCase() === "admin");

  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    setMounted(true);
    console.log("User Data on Profile Load:", user);
    if (user) {
      setFormData({
        fullname: user.fullname || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleUpdate = async () => {
    console.log(user);
    if (!user?._id && !user?.id) {
      addNotification("User ID not found. Please log in again.", "error");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Call the API
      const updatedUser = await authService.updateProfile(
        user._id || user.id,
        formData,
      );

      // 2. Update local Zustand store (Ensure token is passed back)
      if (updatedUser) {
        setAuth(updatedUser, token || "");
        addNotification("Profile updated successfully!", "success");
        setIsEditing(false); // Exit edit mode
      }
    } catch (error: any) {
      console.error("Profile Update Error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update profile";
      addNotification(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-orange-600/10" />
            <div className="relative pt-4 flex flex-col items-center">
              <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden mb-4 group">
                <Image
                  src={`https://i.pravatar.cc/150?u=${user?.email}`}
                  alt={user?.fullname || "User"}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Camera className="text-white" size={24} />
                </div>
              </div>
              <h2 className="text-2xl font-black text-gray-900">
                {user?.fullname}
              </h2>
              <p className="text-sm text-gray-500 font-medium italic">
                {isAdmin ? "Administrator" : "Customer"}
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-50 flex justify-around">
              <div className="text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Orders
                </p>
                <p className="text-xl font-black text-gray-900">24</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Points
                </p>
                <p className="text-xl font-black text-orange-600">1,250</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {isAdmin && (
              <Link
                href="/admin"
                className="w-full flex items-center justify-center gap-2 text-white font-bold py-4 rounded-2xl bg-gray-900 hover:bg-gray-800 transition-all active:scale-95 shadow-md"
              >
                <LayoutDashboard size={20} />
                Go to Dashboard
              </Link>
            )}

            <button
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
              className="w-full flex items-center justify-center gap-2 text-red-500 font-bold py-4 rounded-2xl bg-red-50 hover:bg-red-100 transition-all active:scale-95"
            >
              <LogOut size={20} /> Log Out
            </button>
          </div>
        </motion.div>

        {/* Right Column: Details & Settings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="bg-gradient-to-br from-orange-600 to-orange-500 p-8 rounded-[3rem] text-white shadow-xl shadow-orange-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-black">Gusto Rewards</h3>
                <p className="opacity-80 text-sm">
                  You are 250 points away from a free burger!
                </p>
              </div>
              <Award size={32} />
            </div>
            <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
              <div className="bg-white h-full w-[75%]" />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <Settings size={22} className="text-orange-600" /> Account
                Settings
              </h3>
              {isEditing && (
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                  Full Name
                </label>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus-within:border-orange-500 focus-within:bg-white transition-all">
                  <User size={18} className="text-gray-400" />
                  {isEditing ? (
                    <input
                      className="bg-transparent w-full font-bold text-gray-700 outline-none"
                      value={formData.fullname}
                      onChange={(e) =>
                        setFormData({ ...formData, fullname: e.target.value })
                      }
                    />
                  ) : (
                    <span className="font-bold text-gray-700">
                      {user?.fullname}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1 opacity-60">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                  Email Address
                </label>
                <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-2xl">
                  <Mail size={18} className="text-gray-400" />
                  <span className="font-bold text-gray-700 overflow-auto no-scrollbar">
                    {user?.email}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                  Phone Number
                </label>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus-within:border-orange-500 focus-within:bg-white transition-all">
                  <Phone size={18} className="text-gray-400" />
                  {isEditing ? (
                    <input
                      className="bg-transparent w-full font-bold text-gray-700 outline-none"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  ) : (
                    <span className="font-bold text-gray-700">
                      {user?.phone}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                  Default Payment
                </label>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                  <CreditCard size={18} className="text-gray-400" />
                  <span className="font-bold text-gray-700">
                    Visa •••• 4242
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                Primary Address
              </label>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus-within:border-orange-500 focus-within:bg-white transition-all">
                <MapPin size={18} className="text-gray-400 mt-0.5" />
                {isEditing ? (
                  <textarea
                    rows={2}
                    className="bg-transparent w-full font-bold text-gray-700 outline-none resize-none"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                ) : (
                  <span className="font-bold text-gray-700 leading-relaxed">
                    {user?.address}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (isEditing) {
                  handleUpdate();
                } else {
                  setIsEditing(true);
                }
              }}
              disabled={isLoading}
              className={cn(
                "w-full py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2",
                isEditing
                  ? "bg-orange-600 text-white hover:bg-orange-700 shadow-orange-200"
                  : "bg-gray-900 text-white hover:bg-orange-600 shadow-gray-200",
                isLoading && "opacity-70 cursor-not-allowed",
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Saving...
                </>
              ) : isEditing ? (
                <>
                  <Check size={20} /> Save New Details
                </>
              ) : (
                "Update Profile"
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
