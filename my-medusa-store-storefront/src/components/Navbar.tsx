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
  Loader2,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/context/cart-context";
import { useWishlist } from "@/lib/context/wishlist-context";
import { MedusaProduct } from "@/lib/medusa/mappers";
import { useAccount } from "@/lib/context/account-context";
import { signout } from "@/lib/data/customer";
import { searchProducts } from "@/lib/medusa/get-products";

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

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MedusaProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCollectionsOpen, setIsMobileCollectionsOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const { itemCount: cartCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { customer } = useAccount();
  const router = useRouter();

  // Debounced search logic
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 1) {
        setIsSearching(true);
        const results = await searchProducts(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close search results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProductClick = (handle: string, collectionHandle: string) => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchOpen(false);
    router.push(`/collections/${collectionHandle}/products/${handle}`);
  };

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
                className="text-white text-sm font-bold uppercase hover:text-cloudsfit-purple transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {/* COLLECTIONS */}
            <div className="relative group">
              <button className="text-white text-sm font-bold uppercase flex items-center gap-1 group-hover:text-cloudsfit-purple transition-colors">
                COLLECTIONS <ChevronDown size={16} />
              </button>

              <div className="absolute left-0 w-56 bg-neutral-900 border border-neutral-800 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition py-4 shadow-xl translate-y-2 group-hover:translate-y-0 duration-300">
                {collections.map((col) => (
                  <Link
                    key={col.name}
                    href={col.href}
                    className="block px-6 py-2 text-gray-300 hover:text-cloudsfit-purple hover:bg-neutral-800 transition-colors"
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
            <div className="hidden lg:flex items-center" ref={searchRef}>
              {!isSearchOpen ? (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="text-white hover:text-cloudsfit-purple transition-colors p-2"
                >
                  <Search size={22} />
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-neutral-900 border border-cloudsfit-purple/50 rounded-lg px-3 py-2 animate-in fade-in zoom-in duration-200">
                  <Search size={18} className="text-cloudsfit-purple" />

                  <input
                    autoFocus
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none w-48 lg:w-64"
                  />

                  {isSearching ? (
                    <Loader2 size={18} className="text-cloudsfit-purple animate-spin" />
                  ) : (
                    <button
                      onClick={() => {
                        if (searchQuery) {
                          setSearchQuery("");
                          setSearchResults([]);
                        } else {
                          setIsSearchOpen(false);
                        }
                      }}
                      className="ml-1 hover:text-red-400 transition-colors"
                      title={searchQuery ? "Clear search" : "Close search"}
                    >
                      <X size={18} className={searchQuery ? "text-gray-500" : "text-gray-400"} />
                    </button>
                  )}
                </div>
              )}

              {/* DESKTOP SEARCH RESULTS DROPDOWN */}
              {searchResults.length > 0 && isSearchOpen && (
                <div className="absolute top-[60px] right-0 w-[400px] bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl overflow-hidden z-[100] animate-in slide-in-from-top-2 duration-300">
                  <div className="p-2 border-b border-neutral-800 bg-neutral-900/50">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 py-1">
                      Search Results ({searchResults.length})
                    </p>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductClick(product.id, product.collectionHandle)}
                        className="flex items-center gap-4 p-3 hover:bg-neutral-800 transition-colors cursor-pointer group"
                      >
                        <div className="w-16 h-16 bg-neutral-800 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-white group-hover:text-cloudsfit-purple transition-colors truncate">
                            {product.name}
                          </h4>
                          <p className="text-cloudsfit-blue font-bold text-sm">
                            {product.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-neutral-950 border-t border-neutral-800 text-center">
                    <Link
                      href="/shop"
                      onClick={() => { setIsSearchOpen(false); setSearchResults([]); }}
                      className="text-xs text-gray-500 hover:text-white transition-colors uppercase font-bold tracking-tighter"
                    >
                      View all products
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* MOBILE ICONS / MENU */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white p-2 rounded-full hover:bg-neutral-800/60 transition-colors"
                aria-label="Open menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* from md up: show full icons */}
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/account" aria-label="Account" className="text-white hover:text-cloudsfit-purple transition-all flex items-center gap-2 group">
                <div className="p-2 rounded-full bg-neutral-900 group-hover:bg-neutral-800 transition-colors">
                  <User size={22} className={customer ? "text-cloudsfit-blue" : "text-white"} />
                </div>
                {customer && (
                  <span className="text-xs font-bold uppercase tracking-tight max-w-[80px] truncate">
                    {customer.first_name}
                  </span>
                )}
              </Link>

              <Link href="/wishlist" aria-label="Wishlist" className={`relative text-white p-2 rounded-full hover:bg-neutral-800/60 transition-colors ${wishlistItems.length > 0 ? "ring-2 ring-cloudsfit-purple/30" : ""}`}>
                <Heart size={22} />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              <Link href="/cart" className="relative text-white p-2 rounded-full hover:bg-neutral-800/60 transition-colors">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-cloudsfit-purple text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-neutral-900 border-b border-neutral-800 px-6 py-6 space-y-6 animate-in slide-in-from-top-4 duration-300">
            <div className="space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    router.push(link.href);
                  }}
                  className="block text-white text-lg font-bold py-2 text-left w-full hover:text-cloudsfit-purple transition-colors"
                >
                  {link.name}
                </button>
              ))}

              {/* COLLECTIONS MOBILE */}
              <div className="space-y-3">
                <button
                  onClick={() => setIsMobileCollectionsOpen(!isMobileCollectionsOpen)}
                  className="flex items-center justify-between w-full text-white py-2 text-left hover:text-cloudsfit-purple transition-colors"
                  aria-expanded={isMobileCollectionsOpen}
                >
                  <span className="text-lg font-bold">COLLECTIONS</span>
                  <ChevronDown
                    size={20}
                    className={`transition-transform duration-300 ${isMobileCollectionsOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isMobileCollectionsOpen && (
                  <div className="pl-4 space-y-4 pb-2 border-l border-neutral-800 ml-1 mt-2">
                    {collections.map((col) => (
                      <button
                        key={col.name}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsMobileCollectionsOpen(false);
                          router.push(col.href);
                        }}
                        className="block text-gray-400 hover:text-cloudsfit-purple transition-colors text-base w-full text-left"
                      >
                        {col.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-neutral-800 pt-6 grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setIsSearchOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 text-white py-3 px-4 bg-neutral-800 rounded-lg"
              >
                <Search size={20} /> Search
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push("/account");
                }}
                className="flex items-center gap-3 text-white py-3 px-4 bg-neutral-800 rounded-lg"
              >
                <User size={20} /> Account
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push("/wishlist");
                }}
                className="flex items-center gap-3 text-white py-3 px-4 bg-neutral-800 rounded-lg relative"
              >
                <Heart size={20} /> Wishlist
                {wishlistItems.length > 0 && (
                  <span className="ml-auto bg-red-500 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {wishlistItems.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push("/cart");
                }}
                className="flex items-center gap-3 text-white py-3 px-4 bg-neutral-800 rounded-lg relative"
              >
                <ShoppingCart size={20} /> Cart
                {cartCount > 0 && (
                  <span className="ml-auto bg-cloudsfit-purple text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* MOBILE SEARCH MODAL */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/90 z-[70] flex flex-col p-6 animate-in fade-in duration-300 lg:hidden">
          <div className="flex items-center justify-between mb-8">
            <span className="text-xl font-extrabold tracking-widest bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent">
              SEARCH
            </span>
            <button
              onClick={() => { setIsSearchOpen(false); setSearchQuery(""); setSearchResults([]); }}
              className="p-2 bg-neutral-800 rounded-full text-white"
            >
              <X size={24} />
            </button>
          </div>

          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cloudsfit-purple" size={20} />
            <input
              autoFocus
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-4 pl-12 pr-4 text-white focus:border-cloudsfit-purple outline-none transition-all"
            />
            {isSearching && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-cloudsfit-purple animate-spin" size={20} />
            )}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            {searchResults.length > 0 ? (
              <div className="grid gap-4">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product.id, product.collectionHandle)}
                    className="flex items-center gap-4 bg-neutral-900/50 p-3 rounded-xl border border-neutral-800"
                  >
                    <div className="w-20 h-20 bg-neutral-800 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg leading-tight mb-1">{product.name}</h4>
                      <p className="text-cloudsfit-blue font-bold text-base">{product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchQuery.length >= 1 && !isSearching ? (
              <div className="text-center py-20 text-gray-500">
                <p>No products found for "{searchQuery}"</p>
              </div>
            ) : (
              <div className="text-center py-20 text-gray-600">
                <p>Start typing to search...</p>
              </div>
            )}
          </div>
        </div>
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
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #000;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #444;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #666;
        }
      `}</style>
    </>
  );
}
