"use client";

import Link from "next/link";
import { Instagram, Twitter, Youtube, Twitch } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer className="bg-black text-white pt-12 md:pt-20 pb-8">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
        {/* Brand Section */}
        <div className="flex flex-col">
          <div className="text-xl md:text-2xl font-extrabold mb-4">
            <span className="text-cloudsfit-purple">⬤</span> CloudsFit
          </div>
          <p className="text-gray-400 text-sm mb-6 line-clamp-3">
            Level up your wardrobe with anime & gaming inspired streetwear. Mode for legends.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-cloudsfit-purple transition">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-cloudsfit-purple transition">
              <Twitter size={18} />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-cloudsfit-purple transition">
              <Youtube size={18} />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-cloudsfit-purple transition">
              <Twitch size={18} />
            </a>
          </div>
        </div>

        {/* Shop Links */}
        <div>
          <h3 className="font-bold text-base md:text-lg mb-4 md:mb-6 uppercase tracking-wider text-cloudsfit-purple">SHOP</h3>
          <ul className="space-y-2 md:space-y-3">
            <li><Link href="/new-arrivals" className="text-gray-400 hover:text-white transition text-sm md:text-base">New Drops</Link></li>
            <li><Link href="/shop" className="text-gray-400 hover:text-white transition text-sm md:text-base">Shop All</Link></li>
            <li><Link href="/best-sellers" className="text-gray-400 hover:text-white transition text-sm md:text-base">Best Sellers</Link></li>
            <li><Link href="#" className="text-gray-400 hover:text-white transition text-sm md:text-base">Anime Collection</Link></li>
            <li><Link href="#" className="text-gray-400 hover:text-white transition text-sm md:text-base">MLBB Collection</Link></li>
            <li><Link href="#" className="text-gray-400 hover:text-white transition text-sm md:text-base">Gaming Hoodies</Link></li>
            
          </ul>
        </div>

        {/* Help Links */}
        <div>
          <h3 className="font-bold text-base md:text-lg mb-4 md:mb-6 uppercase tracking-wider text-cloudsfit-purple">HELP</h3>
          <ul className="space-y-2 md:space-y-3">
            <li><Link href="#" className="text-gray-400 hover:text-white transition text-sm md:text-base">Track Order</Link></li>
            <li><Link href="#" className="text-gray-400 hover:text-white transition text-sm md:text-base">Shipping Info</Link></li>
            <li><Link href="#" className="text-gray-400 hover:text-white transition text-sm md:text-base">Returns & Exchange</Link></li>
            <li><Link href="#" className="text-gray-400 hover:text-white transition text-sm md:text-base">Size Guide</Link></li>
            <li><Link href="#" className="text-gray-400 hover:text-white transition text-sm md:text-base">Contact Us</Link></li>
          </ul>
        </div>

        {/* Community Links */}
        <div>
          <h3 className="font-bold text-base md:text-lg mb-4 md:mb-6 uppercase tracking-wider text-cloudsfit-purple">COMMUNITY</h3>
          <ul className="space-y-2 md:space-y-3">
            <li><Link href="/about" className="text-gray-400 hover:text-white transition text-sm md:text-base">About Us</Link></li>
            <li><Link href="#" className="text-gray-400 hover:text-white transition text-sm md:text-base">Discord Server</Link></li>
            <li><Link href="#" className="text-gray-400 hover:text-white transition text-sm md:text-base">Player Spotlight</Link></li>
            <li><Link href="#" className="text-gray-400 hover:text-white transition text-sm md:text-base">Blog</Link></li>
          </ul>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-neutral-800 pt-12 md:pt-16 pb-12">
        <div className="max-w-3xl mx-auto text-center px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-2 uppercase tracking-wider">
            JOIN THE <span className="text-cloudsfit-purple">SQUAD</span>
          </h2>
          <p className="text-gray-400 mb-6 md:mb-8 text-sm md:text-base">
            Get exclusive drops, early access & legendary offers straight to your inbox.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 md:px-6 py-2 md:py-3 bg-neutral-900 border border-cloudsfit-purple/30 rounded text-white placeholder-gray-600 focus:outline-none focus:border-cloudsfit-purple transition text-sm md:text-base"
            />
            <button
              type="submit"
              className="px-6 md:px-8 py-2 md:py-3 bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue text-white font-bold rounded hover:opacity-90 transition uppercase tracking-wider text-sm md:text-base whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-neutral-800 pt-6 md:pt-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs md:text-sm gap-4 md:gap-0">
          <p>© 2026 CloudsFit. All rights reserved. 🎮</p>
          <div className="flex gap-4 md:gap-6 flex-wrap justify-center md:justify-end">
            <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
