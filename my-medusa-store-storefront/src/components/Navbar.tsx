"use client";

import Link from "next/link";
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  ChevronDown,
  X,
  Menu,
  Gamepad2,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/context/cart-context";
import { useWishlist } from "@/lib/context/wishlist-context";

const navLinks = [
  { name: "SHOP ALL", href: "/shop" },
  { name: "NEW DROPS", href: "/new-arrivals" },
  { name: "BEST SELLERS", href: "/best-sellers" },
  { name: "ABOUT", href: "/about" },
];

const collections = [
  { name: "Regular Tees", href: "/collections/regular-tees" },
  { name: "Oversized Tees", href: "/collections/oversized-tees" },
  { name: "Acid Wash", href: "/collections/acid-wash" },
  { name: "Oversized Hoodies", href: "/collections/hoodies" },
  { name: "Sweatshirts", href: "/collections/sweatshirts" },
];

const allProducts = [
  "GUSION2-MLBB - OVERSIZED TEES",
  "GUSION-MLBB - OVERSIZED TEES",
  "MINIMALIST GAMING SWEATSHIRT",
  "RETRO PIXEL ART SWEATSHIRT",
  "ANIME COZY OVERSIZED HOODIE",
  "DEMON SLAYER OVERSIZED",
  "ATTACK ON TITAN SCOUT TEE",
  "REGULAR TEES - CLASSIC FIT",
  "ACID WASH COLLECTION",
];

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);

  const { itemCount: cartCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const router = useRouter();

  const filteredProducts = allProducts.filter((product) =>
    product.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* 🔥 MARQUEE BAR */}
      <div className="fixed top-0 left-0 w-full z-[60] overflow-hidden bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500">
        <div className="marquee whitespace-nowrap flex gap-16 py-2 text-white text-[12px] md:text-sm font-semibold tracking-wide">
          <span>⚔ LEGENDARY DROP INCOMING | Use code MLBB100 for ₹100 OFF | FREE Shipping on Orders ₹999+</span>
          <span>⚔ LEGENDARY DROP INCOMING | Use code MLBB100 for ₹100 OFF | FREE Shipping on Orders ₹999+</span>
          <span>⚔ LEGENDARY DROP INCOMING | Use code MLBB100 for ₹100 OFF | FREE Shipping on Orders ₹999+</span>
          <span>⚔ LEGENDARY DROP INCOMING | Use code MLBB100 for ₹100 OFF | FREE Shipping on Orders ₹999+</span>
        </div>
      </div>

      <nav className="fixed top-[36px] left-0 w-full z-50 bg-black border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Gamepad2 className="text-purple-400" size={22} />
              <span className="text-xl md:text-2xl font-extrabold tracking-widest bg-gradient-to-r from-purple-500 via-blue-400 to-pink-500 bg-clip-text text-transparent">
                CloudsFit
              </span>
            </Link>
          </div>

          {/* CENTER NAV */}
          <div className="hidden lg:flex gap-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-white text-sm font-bold uppercase hover:text-cloudsfit-purple"
              >
                {link.name}
              </Link>
            ))}

            {/* COLLECTIONS */}
            <div className="relative group">
              <button className="text-white text-sm font-bold uppercase flex items-center gap-1">
                COLLECTIONS <ChevronDown size={16} />
              </button>

              <div className="absolute left-0 w-56 bg-neutral-900 border border-neutral-800 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition py-4">
                {collections.map((col) => (
                  <Link
                    key={col.name}
                    href={col.href}
                    className="block px-6 py-2 text-gray-300 hover:text-cloudsfit-purple hover:bg-neutral-800"
                  >
                    {col.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-4">

            {/* ✅ DESKTOP SEARCH TOGGLE */}
            <div className="hidden lg:flex items-center">
              {!isSearchOpen ? (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="text-white hover:text-cloudsfit-purple"
                >
                  <Search size={20} />
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-neutral-900 border border-cloudsfit-purple rounded-lg px-3 py-2">
                  <Search size={18} className="text-cloudsfit-purple" />

                  <input
                    autoFocus
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none w-32 lg:w-48"
                  />

                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* small/tablet: show only menu button (visible up to md); desktop (lg) shows full icons */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white p-2 rounded-full hover:bg-neutral-800/60"
                aria-label="Open menu"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

            {/* from md up: show full icons */}
            <div className="hidden lg:flex items-center gap-4">

              <Link href="/account" aria-label="Account" className="text-white p-2 rounded-full hover:bg-neutral-800/60">
                <User size={20} />
              </Link>

              <Link href="/wishlist" aria-label="Wishlist" className={`relative text-white p-2 rounded-full hover:bg-neutral-800/60 ${wishlistItems.length > 0 ? "ring-2 ring-cloudsfit-purple" : ""}`}>
                <Heart size={20} />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              <Link href="/cart" className="relative text-white">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-cloudsfit-purple text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-neutral-900 border-b border-neutral-800 px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push(link.href);
                }}
                className="block text-white py-2 text-left w-full"
              >
                {link.name}
              </button>
            ))}

            <div className="border-t border-neutral-800 pt-3">
              <button
                onClick={() => {
                  setIsSearchOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left flex items-center gap-3 text-white py-2"
              >
                <Search size={18} /> Search
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push("/account");
                }}
                className="w-full text-left flex items-center gap-3 text-white py-2"
              >
                <User size={18} /> Account
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push("/wishlist");
                }}
                className="w-full text-left flex items-center gap-3 text-white py-2 relative"
              >
                <Heart size={18} /> Wishlist
                {wishlistItems.length > 0 && (
                  <span className="ml-auto bg-red-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push("/cart");
                }}
                className="w-full text-left flex items-center gap-3 text-white py-2 relative"
              >
                <ShoppingCart size={18} /> Cart
                {cartCount > 0 && (
                  <span className="ml-auto bg-cloudsfit-purple text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* DESKTOP SEARCH RESULT */}
      {searchQuery && (
        <div className="hidden lg:block absolute top-[92px] left-0 right-0 bg-black border-b border-neutral-800 px-6 py-4 z-40">
          <div className="max-w-7xl mx-auto bg-neutral-900 rounded border border-neutral-800">
            {filteredProducts.map((product, i) => (
              <div key={i} className="px-6 py-3 text-gray-300">
                {product}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MOBILE SEARCH MODAL */}
      {isSearchOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/80 z-40 lg:hidden"
            onClick={() => setIsSearchOpen(false)}
          />
          <div className="fixed top-[92px] left-0 right-0 bg-black px-4 py-4 z-40 lg:hidden">
            <div className="flex items-center gap-3 bg-neutral-900 border border-cloudsfit-purple rounded-lg px-3 py-3">
              <Search size={20} className="text-cloudsfit-purple" />
              <input
                autoFocus
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-white"
              />
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* MARQUEE ANIMATION */}
      <style jsx global>{`
        .marquee {
          min-width: 200%;
          animation: marquee 18s linear infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </>
  );
}
