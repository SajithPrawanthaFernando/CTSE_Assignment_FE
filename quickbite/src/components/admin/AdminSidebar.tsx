"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  LayoutDashboard,
  ShoppingBag,
  Settings,
  ArrowLeft,
  PieChart,
  UtensilsCrossed,
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: UtensilsCrossed },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Analytics", href: "/admin/analytics", icon: PieChart },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen sticky top-0 bg-white border-r border-gray-100 p-6 flex flex-col">
      <div className="mb-10 px-2">
        <Link href="/" className="text-xl font-black text-orange-600">
          Gusto<span className="text-gray-900">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-2">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all",
                isActive
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-200"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <Icon size={20} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-gray-50">
        <Link
          href="/menu"
          className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-400 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Site
        </Link>
      </div>
    </aside>
  );
};
