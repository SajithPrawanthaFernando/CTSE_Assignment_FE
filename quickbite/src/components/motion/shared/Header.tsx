"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // Added for Avatar
import { usePathname } from "next/navigation";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { ShoppingCart, Menu, X, Bell, UserPlus, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useAuth } from "@/store/useAuth";
import { HeaderSkeleton } from "./HeaderSkeleton";

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useAuth();
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  const { scrollY } = useScroll();

  useEffect(() => {
    setMounted(true);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Orders", href: "/orders" },
  ];

  if (!mounted || isAdminRoute) {
    return isAdminRoute ? null : <HeaderSkeleton />;
  }

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4",
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        {/* 1. Logo Section */}
        <div className="flex-1">
          <Link
            href="/"
            className="text-2xl font-black tracking-tight text-orange-600"
          >
            Gusto<span className="text-gray-900">Bistro</span>
          </Link>
        </div>

        {/* 2. Desktop Nav */}
        <nav
          className="hidden md:flex items-center gap-8 flex-1 justify-center"
          onMouseLeave={() => setHoveredLink(null)}
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onMouseEnter={() => setHoveredLink(link.name)}
              className={cn(
                "relative text-sm font-bold transition-colors py-1",
                isScrolled ? "text-gray-700" : "text-gray-900",
                "hover:text-orange-600",
              )}
            >
              {link.name}
              {hoveredLink === link.name && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* 3. Icons & Auth Actions */}
        <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
          <Link
            href="/notifications"
            className={cn(
              "relative p-2 rounded-full transition-colors",
              isScrolled
                ? "hover:bg-gray-100 text-gray-700"
                : "hover:bg-white/20 text-gray-900",
            )}
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </Link>

          <Link
            href="/cart"
            className={cn(
              "p-2 rounded-full transition-colors mr-2",
              isScrolled
                ? "hover:bg-gray-100 text-gray-700"
                : "hover:bg-white/20 text-gray-900",
            )}
          >
            <ShoppingCart size={20} />
          </Link>

          {/* Dynamic Auth Section */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link href="/profile" className="flex items-center gap-3 group">
                  <div className="flex flex-col items-end">
                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-wider",
                        isScrolled ? "text-gray-400" : "text-gray-500",
                      )}
                    >
                      Welcome
                    </span>
                    <span className="text-sm font-black leading-none text-gray-900">
                      {user?.fullname?.split(" ")[0]}
                    </span>
                  </div>

                  {/* Desktop User Avatar Image */}
                  <div className="relative w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden group-hover:scale-110 transition-transform bg-orange-100">
                    <Image
                      src={`https://i.pravatar.cc/150?u=${user?.email}`}
                      alt={user?.fullname || "User Avatar"}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>

                <button
                  onClick={() => logout()}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <Link href="/login">
                    <LogOut size={20} />
                  </Link>
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(
                    "text-sm font-bold transition-colors px-4 py-2 rounded-full",
                    isScrolled
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-gray-900 hover:bg-white/20",
                  )}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-full font-bold hover:bg-orange-700 transition-all active:scale-95 shadow-lg shadow-orange-200"
                >
                  <UserPlus size={18} />
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 text-gray-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white border-t shadow-2xl py-8 flex flex-col items-center gap-6 md:hidden rounded-b-[2rem]"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-2xl font-black text-gray-900"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col w-full px-10 gap-4 pt-4 border-t border-gray-100">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className="w-full text-center py-4 text-lg font-bold text-gray-900 border border-gray-200 rounded-2xl flex items-center justify-center gap-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {/* Mobile Menu Avatar Image */}
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                      <Image
                        src={`https://i.pravatar.cc/150?u=${user?.email}`}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    </div>
                    My Profile ({user?.fullname?.split(" ")[0]})
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-center flex flex-row items-center justify-center gap-2 py-4 text-lg font-bold text-white bg-red-500 rounded-2xl transition-colors hover:bg-red-600"
                  >
                    <Link className="flex flex-row gap-x-2" href="/login">
                      <LogOut className="mt-1" size={20} /> Log Out
                    </Link>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="w-full text-center py-4 text-lg font-bold text-gray-900 border border-gray-200 rounded-2xl"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="w-full text-center py-4 text-lg font-bold text-white bg-orange-600 rounded-2xl"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
