import { Suspense } from "react"

import { listRegions } from "@/lib/data/regions"
import { listLocales } from "@/lib/data/locales"
import { getLocale } from "@/lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import CartButton from "@/modules/layout/components/cart-button"
import Link from "next/link"
import NavSearchTrigger from "@/modules/search/components/nav-search-trigger"
import NavCollections from "@/modules/layout/components/nav-collections"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 h-8 flex items-center justify-center overflow-hidden">
        <div className="animate-scroll whitespace-nowrap flex gap-8">
          <span className="text-white text-xs sm:text-sm font-semibold">
            ðŸ’Ž LEGENDARY DROP INCOMING | Use code MLB8100 for â‚¹100 OFF | FREE Shipping on Orders â‚¹999+ âš”ï¸
          </span>
          <span className="text-white text-xs sm:text-sm font-semibold">
            ðŸ’Ž LEGENDARY DROP INCOMING | Use code MLB8100 for â‚¹100 OFF | FREE Shipping on Orders â‚¹999+ âš”ï¸
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="relative h-20 mx-auto duration-200 bg-black/90 backdrop-blur-md border-b border-gray-800">
        <nav className="px-4 sm:px-6 lg:px-8 flex items-center justify-between w-full h-full max-w-7xl mx-auto">
          {/* Left: Mobile Menu (3-line hamburger) & Logo */}
          <div className="flex items-center h-full gap-4">
            {/* Mobile Hamburger Menu (3 lines) */}
            <button className="lg:hidden text-white hover:text-cloudsfit-purple transition-colors p-2" aria-label="Menu">
              <div className="w-6 h-0.5 bg-white mb-1.5 rounded-full"></div>
              <div className="w-6 h-0.5 bg-white mb-1.5 rounded-full"></div>
              <div className="w-6 h-0.5 bg-white rounded-full"></div>
            </button>

            {/* CloudsFit Logo - Home */}
            <LocalizedClientLink
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
              data-testid="nav-store-link"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue rounded-lg flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(124,58,237,0.5)]">
                <span className="text-white font-bold text-lg">ðŸŽ®</span>
              </div>
              <span className="font-bold text-white text-xl uppercase tracking-tighter">CloudsFit</span>
            </LocalizedClientLink>
          </div>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-10 h-full">
            <NavLink href="/store">SHOP ALL</NavLink>
            <NavLink href="/store?type=new">NEW DROPS</NavLink>
            <NavLink href="/store?type=best">BEST SELLERS</NavLink>
            <NavLink href="/about">ABOUT US</NavLink>
            <NavCollections />
          </div>

          {/* Right: Icons (Search, Wishlist, Account, Cart) */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Search */}
            <NavSearchTrigger />

            {/* Account Icon */}
            <LocalizedClientLink
              href="/account"
              className="text-white hover:text-cloudsfit-purple transition-colors duration-200"
              data-testid="nav-account-link"
              aria-label="Account"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </LocalizedClientLink>

            {/* Cart Button */}
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="text-white hover:text-cloudsfit-purple transition-colors duration-200"
                  href="/cart"
                  data-testid="nav-cart-link"
                  aria-label="Cart"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}

// Navigation Link Component
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <LocalizedClientLink
      href={href}
      className="text-sm font-medium text-white/80 hover:text-blue-400 transition-colors duration-200 uppercase tracking-wide"
    >
      {children}
    </LocalizedClientLink>
  )
}


