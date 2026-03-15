"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <h3 className="text-white text-xl font-bold">GustoBistro</h3>
          <p className="text-sm leading-relaxed">
            Bringing the finest flavors straight to your doorstep. Fresh
            ingredients, masterful chefs.
          </p>
          <div className="flex gap-4">
            <Facebook
              size={20}
              className="hover:text-orange-500 cursor-pointer"
            />
            <Instagram
              size={20}
              className="hover:text-orange-500 cursor-pointer"
            />
            <Twitter
              size={20}
              className="hover:text-orange-500 cursor-pointer"
            />
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/menu" className="hover:text-orange-500">
                View Menu
              </Link>
            </li>
            <li>
              <Link href="/orders" className="hover:text-orange-500">
                Track Order
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-orange-500">
                Our Story
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Support</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/contact" className="hover:text-orange-500">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-orange-500">
                FAQs
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-orange-500">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Open Hours</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li>Mon - Fri: 9:00 AM - 10:00 PM</li>
            <li>Sat - Sun: 10:00 AM - 11:00 PM</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-gray-800 mt-12 pt-8 text-center text-xs">
        © {new Date().getFullYear()} GustoBistro. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
