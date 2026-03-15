"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { adminService } from "@/services/admin.service";
import { useNotificationStore } from "@/store/useNotificationStore";
import {
  Trash2,
  ShieldCheck,
  Search,
  Loader2,
  X,
  AlertTriangle,
  ArrowRight,
  MoreHorizontal,
  Bell,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Colors updated to match the "Pending" (Orange) and "Done" (Teal) aesthetic
const ROLES = [
  { id: "admin", label: "ADMIN", color: "bg-teal-100 text-teal-700" },
  {
    id: "restaurantOwner",
    label: "OWNER",
    color: "bg-orange-100 text-orange-700",
  },
  { id: "user", label: "USER", color: "bg-blue-100 text-blue-700" },
  { id: "driver", label: "DRIVER", color: "bg-purple-100 text-purple-700" },
];

// Helper to safely grab role colors regardless of how the DB formats the string
const getRoleInfo = (roleStr?: string) => {
  const s = (roleStr || "user").toLowerCase();
  if (s.includes("admin")) return ROLES[0];
  if (s.includes("owner")) return ROLES[1];
  if (s.includes("driver") || s.includes("delivery")) return ROLES[3];
  return ROLES[2]; // Default to User
};

const CHART_DATA = [30, 50, 40, 80, 100, 60, 75];

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [modalType, setModalType] = useState<"role" | "delete" | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (error) {
      addNotification("Admin session expired", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const adminCount = users.filter(
    (u) => getRoleInfo(u.roles?.[0]).id === "admin",
  ).length;
  const customerCount = users.filter(
    (u) => getRoleInfo(u.roles?.[0]).id === "user",
  ).length;
  const ownerCount = users.filter(
    (u) => getRoleInfo(u.roles?.[0]).id === "restaurantOwner",
  ).length;
  const maxCount = Math.max(adminCount, customerCount, ownerCount, 1);

  const handleUpdateRole = async (newRole: string) => {
    if (!selectedUser) return;
    setIsProcessing(true);
    try {
      await adminService.changeRole(selectedUser._id, newRole);
      setUsers(
        users.map((u) =>
          u._id === selectedUser._id ? { ...u, roles: [newRole] } : u,
        ),
      );
      addNotification("Role updated successfully", "success");
      setModalType(null);
    } catch (error) {
      addNotification("Update failed", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteUser = async () => {
    console.log("Attempting to delete user:", users);
    if (!selectedUser) return;
    setIsProcessing(true);
    try {
      await adminService.deleteUser(selectedUser._id);
      setUsers(users.filter((u) => u._id !== selectedUser._id));
      addNotification("Account deleted", "success");
      setModalType(null);
    } catch (error) {
      addNotification("Delete failed", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8f9fc]">
        <Loader2 className="animate-spin text-gray-900" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6 md:p-10 font-sans text-gray-900">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-extrabold tracking-tight">Registry</h1>
          <div className="hidden md:flex bg-gray-200/50 p-1 rounded-2xl">
            <button className="bg-white px-5 py-2 rounded-xl text-sm font-bold shadow-sm">
              Full Statistics
            </button>
            <button className="px-5 py-2 rounded-xl text-sm font-bold text-gray-500 hover:text-gray-900">
              Results Summary
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50">
            +
          </button>
          <div className="w-10 h-10 rounded-full bg-purple-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center font-bold text-purple-700">
            A
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* ROW 1: THE 4 TOP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Card 1: Team */}
          <div className="bg-white p-6 rounded-[24px] shadow-[0_2px_12px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col justify-between h-[180px]">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg leading-tight">
                Active
                <br />
                Team
              </h3>
              <Bell size={18} className="text-gray-400" />
            </div>
            <div>
              <div className="flex items-center text-xs text-gray-500 font-medium mb-3">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>{" "}
                System active
              </div>
              <div className="flex -space-x-3">
                {users.slice(0, 4).map((u, i) => (
                  <div
                    key={i}
                    className="relative w-10 h-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden z-10"
                  >
                    <Image
                      src={`https://i.pravatar.cc/150?u=${u.email}`}
                      alt={u.fullname || "User"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-400 z-0 relative">
                  20+
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Total Stats */}
          <div className="bg-white p-6 rounded-[24px] shadow-[0_2px_12px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col justify-between h-[180px]">
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs">
                ★
              </div>
              Total Accounts
            </div>
            <div className="w-full h-12 mt-2">
              <svg
                viewBox="0 0 100 40"
                className="w-full h-full stroke-emerald-400 stroke-[3] fill-none stroke-linecap-round stroke-linejoin-round"
              >
                <path d="M0,30 Q10,20 20,35 T40,15 T60,25 T80,5 T100,15" />
              </svg>
            </div>
            <div className="flex items-end justify-between mt-2">
              <div>
                <h2 className="text-3xl font-extrabold">{users.length}</h2>
                <p className="text-xs text-rose-500 font-bold">
                  ~11% last week
                </p>
              </div>
              <button className="w-10 h-10 bg-gray-900 text-white rounded-[14px] flex items-center justify-center hover:bg-gray-800 transition-colors">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Card 3: Role Chart */}
          <div className="bg-white p-6 rounded-[24px] shadow-[0_2px_12px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col justify-between h-[180px]">
            <h3 className="font-bold text-gray-900">Role statistics</h3>
            <p className="text-xs font-bold text-emerald-500 mb-2">+8%</p>
            <div className="flex-1 flex items-end justify-around gap-3 pt-4">
              <div className="w-full flex flex-col items-center gap-2">
                <div
                  style={{ height: `${(customerCount / maxCount) * 100}%` }}
                  className="w-full bg-teal-100 rounded-t-lg min-h-[20px]"
                ></div>
                <span className="text-[10px] font-bold text-teal-600">
                  {customerCount}
                </span>
              </div>
              <div className="w-full flex flex-col items-center gap-2">
                <div
                  style={{ height: `${(adminCount / maxCount) * 100}%` }}
                  className="w-full bg-purple-100 rounded-t-lg min-h-[20px]"
                ></div>
                <span className="text-[10px] font-bold text-purple-600">
                  {adminCount}
                </span>
              </div>
              <div className="w-full flex flex-col items-center gap-2">
                <div
                  style={{ height: `${(ownerCount / maxCount) * 100}%` }}
                  className="w-full bg-orange-400 rounded-t-lg min-h-[20px]"
                ></div>
                <span className="text-[10px] font-bold text-orange-600">
                  {ownerCount}
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Teal Promo */}
          <div className="bg-gradient-to-br from-teal-400 to-teal-500 p-6 rounded-[24px] shadow-lg shadow-teal-200 flex flex-col justify-between h-[180px] text-white">
            <div className="flex justify-between items-start">
              <h2 className="text-3xl font-extrabold">{users.length}</h2>
              <Sparkles size={20} className="opacity-80" />
            </div>
            <div>
              <p className="font-bold text-sm leading-tight mb-4">
                Manage System
                <br />
                Accounts
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium opacity-90 cursor-pointer hover:underline">
                  Details
                </span>
                <button className="bg-gray-900 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors">
                  Configure
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: RECENT SIGNUPS */}
        <div className="pt-4">
          <h2 className="text-lg font-bold mb-4">Recently Added</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {users.slice(0, 2).map((u, i) => {
              const roleInfo = getRoleInfo(u.roles?.[0]);
              return (
                <div
                  key={i}
                  className="bg-white p-5 rounded-[20px] shadow-[0_2px_12px_rgb(0,0,0,0.02)] border border-gray-100 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                      <Image
                        src={`https://i.pravatar.cc/150?u=${u.email}`}
                        alt={u.fullname || "User"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">
                        {u.fullname}
                      </h4>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">
                        {u.phone || "No phone"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                        roleInfo.color,
                      )}
                    >
                      {roleInfo.label}
                    </span>
                    <button className="text-gray-300 hover:text-gray-600 transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ROW 3: TRANSACTIONS TABLE */}
        <div className="bg-white rounded-[24px] shadow-[0_2px_12px_rgb(0,0,0,0.02)] border border-gray-100 overflow-hidden mt-6">
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50">
            <h2 className="text-xl font-bold">Users</h2>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-full sm:w-64 bg-gray-50 border border-gray-100 py-2.5 pl-10 pr-4 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-100 focus:border-teal-400 transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto p-4">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-400 text-xs font-medium">
                  <th className="px-4 py-2 w-12">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                    />
                  </th>
                  <th className="px-4 py-2">Receiver</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2 pl-20">Action</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredUsers.map((u) => {
                    const roleInfo = getRoleInfo(u.roles?.[0]);
                    return (
                      <motion.tr
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={u.id}
                        className="group hover:bg-gray-50/50 rounded-xl transition-colors"
                      >
                        <td className="px-4 py-3 rounded-l-xl">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 rounded-full bg-gray-100 overflow-hidden shrink-0">
                              <Image
                                src={`https://i.pravatar.cc/150?u=${u.email}`}
                                alt={u.fullname || "User"}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="font-bold text-sm text-gray-900">
                              {u.fullname}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 font-medium">
                          {u.roles?.[0] || "user"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                              roleInfo.color,
                            )}
                          >
                            {roleInfo.label}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-sm font-bold text-gray-900">
                          {u.email}
                        </td>
                        <td className="px-4 py-3 text-right rounded-r-xl">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedUser(u);
                                setModalType("role");
                              }}
                              className="px-3 py-1.5 border border-gray-200 text-[10px] font-bold rounded-lg text-gray-600 hover:bg-gray-50 transition-colors uppercase tracking-wide"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUser(u);
                                setModalType("delete");
                              }}
                              className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {modalType && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/30 backdrop-blur-[2px]">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[24px] w-full max-w-md overflow-hidden shadow-2xl border border-gray-100"
            >
              {modalType === "role" && (
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-700">
                      <ShieldCheck size={20} />
                    </div>
                    <button
                      onClick={() => setModalType(null)}
                      className="text-gray-400 hover:text-gray-900"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Update Access
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Set permissions for {selectedUser?.fullname}.
                  </p>

                  <div className="space-y-2">
                    {ROLES.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => handleUpdateRole(role.id)}
                        className={cn(
                          "w-full p-4 rounded-xl border transition-all flex items-center justify-between",
                          getRoleInfo(selectedUser?.roles?.[0]).id === role.id
                            ? "border-teal-500 bg-teal-50"
                            : "border-gray-100 hover:border-gray-300",
                        )}
                      >
                        <span
                          className={cn(
                            "text-sm font-bold",
                            getRoleInfo(selectedUser?.roles?.[0]).id === role.id
                              ? "text-teal-700"
                              : "text-gray-600",
                          )}
                        >
                          {role.label}
                        </span>
                        {getRoleInfo(selectedUser?.roles?.[0]).id ===
                          role.id && (
                          <CheckCircle2 size={18} className="text-teal-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {modalType === "delete" && (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Confirm Deletion
                  </h3>
                  <p className="text-gray-500 text-sm mb-8">
                    Are you sure you want to delete{" "}
                    <span className="font-bold text-gray-900">
                      {selectedUser?.fullname}
                    </span>
                    ? This cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setModalType(null)}
                      className="flex-1 py-3 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteUser}
                      className="flex-1 py-3 text-sm font-bold text-white bg-rose-500 rounded-xl hover:bg-rose-600 shadow-md shadow-rose-200 transition-all flex justify-center"
                    >
                      {isProcessing ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        "Delete Account"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
