"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { HttpTypes } from "@medusajs/types"

import { getPricesForVariant } from "@/lib/util/get-product-price"
import { useWishlist } from "@/lib/context/wishlist-context"

interface PremiumProductCardProps {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  onAddToCart?: () => void
}

const PremiumProductCard = ({
  product,
  region,
  onAddToCart,
}: PremiumProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const { inWishlist, addItem, removeItem } = useWishlist()
  const isInWishlist = inWishlist(product.id)

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isInWishlist) {
      removeItem(product.id)
    } else {
      addItem(product)
    }
  }

  const variant = product.variants?.[0]
  const prices = variant ? getPricesForVariant(variant) : null

  // Use the values from getPricesForVariant which handles strict types via 'any' casting in utility
  const priceAmount = prices?.calculated_price_number
  const originalAmount = prices?.original_price_number
  const calculatedPrice = prices?.calculated_price
  const originalPriceFormatted = prices?.original_price

  const hasDiscount = priceAmount && originalAmount && priceAmount < originalAmount
  const discountPercentage = prices?.percentage_diff || 0

  // Determine if it's new or featured (simplified for now)
  const isNew = product.tags?.some(tag => tag.value.toLowerCase() === 'new')
  const isFeatured = !isNew // Default to featured if not explicit 'new'

  return (
    <div
      className="group relative bg-[#12121e] rounded-xl overflow-hidden border border-white/5 hover:border-cloudsfit-purple/30 transition-all duration-500 shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.handle}`} className="block">
        {/* Badges & Actions Overlay */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className={`w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-cloudsfit-purple transition-all duration-300 ${isInWishlist ? 'bg-cloudsfit-purple text-white' : 'bg-black/40 text-white/70'}`}
          >
            <svg className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* New/Featured Badge */}
          {isNew ? (
            <span className="px-3 py-1 bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue text-[10px] font-bold text-white rounded-md uppercase tracking-widest shadow-lg">
              NEW
            </span>
          ) : (
            <span className="px-3 py-1 bg-cloudsfit-blue text-[10px] font-bold text-white rounded-md uppercase tracking-widest shadow-lg">
              FEATURED
            </span>
          )}
        </div>

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-4 right-4 z-20">
            <span className="px-3 py-1 bg-[#ff3b3b] text-[10px] font-bold text-white rounded-md uppercase tracking-widest shadow-lg">
              -{discountPercentage}%
            </span>
          </div>
        )}

        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a]">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title || "Product"}
              fill
              className={`object-cover transition-transform duration-700 ease-in-out ${isHovered ? 'scale-110' : 'scale-100'}`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/10">
              <span className="text-4xl font-bold tracking-tighter italic">CLOUDSFIT</span>
            </div>
          )}

          {/* Bottom Fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Quick View Button (Visible on hover) */}
          <div className={`absolute bottom-6 right-6 z-20 transition-all duration-500 transform ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <button className="w-12 h-12 bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] hover:scale-110 transition-all">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <h3 className="text-white font-bold text-sm md:text-base tracking-tight uppercase line-clamp-2 md:h-12 group-hover:text-cloudsfit-purple-light transition-colors">
            {product.title}
          </h3>

          <div className="flex items-center gap-3">
            {calculatedPrice && (
              <span className="text-xl font-black text-cloudsfit-neon-blue">
                {calculatedPrice}
              </span>
            )}
            {hasDiscount && originalPriceFormatted && (
              <span className="text-xs text-gray-500 line-through font-medium">
                {originalPriceFormatted}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default PremiumProductCard

