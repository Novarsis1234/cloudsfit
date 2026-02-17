"use client"

import { useWishlist } from "@/lib/context/wishlist-context"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Heart, Trash2 } from "lucide-react"
import { productsData } from "@/lib/productsData"

export default function WishlistPage() {
    const { items, removeItem } = useWishlist()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Map wishlist items to actual product data
    const wishlistProducts = mounted
        ? items
            .map((item) => {
                // Search for product in all collections
                for (const [handle, products] of Object.entries(productsData)) {
                    const product = products.find((p) => p.id === Number(item.id))
                    if (product) {
                        return { ...product, collection: handle, itemId: item.id }
                    }
                }
                return null
            })
            .filter(Boolean)
        : []

    if (!mounted) {
        return (
            <div className="bg-black min-h-screen pt-0 text-white">
                <div className="max-w-7xl mx-auto px-4">Loading...</div>
            </div>
        )
    }

    return (
        <main className="bg-black min-h-screen text-white pt-6 md:pt-8">
            {/* Header Section */}
            <section className="py-12 bg-gradient-to-r from-purple-900/20 via-black to-blue-900/20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <span className="text-red-500 text-sm font-bold tracking-widest uppercase">
                        ❤️ SAVED FOR LATER
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight mt-4">
                        MY WISHLIST
                    </h1>
                    <p className="text-gray-400">{wishlistProducts.length} items saved</p>
                </div>
            </section>

            {/* Wishlist Items */}
            <section className="py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    {wishlistProducts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {wishlistProducts.map((product: any) => (
                                <div
                                    key={product.itemId}
                                    className="group border border-neutral-800 rounded-lg overflow-hidden hover:border-cloudsfit-purple/50 transition"
                                >
                                    {/* Product Image Container */}
                                    <div className="relative aspect-square bg-neutral-900 overflow-hidden flex items-center justify-center">
                                        <img
                                            src={product.image || product.images?.[0]}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition"
                                        />
                                        
                                        {/* Badge */}
                                        <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                                            <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                SAVED
                                            </div>
                                        </div>

                                        {/* Action Buttons Overlay */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
                                            <Link
                                                href={`/collections/${product.collection}/products/${product.id}`}
                                                className="px-4 py-2 bg-cloudsfit-purple text-white rounded-lg font-semibold text-sm hover:opacity-90 transition"
                                            >
                                                View
                                            </Link>
                                            <button
                                                onClick={() => removeItem(product.itemId)}
                                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                                title="Remove from wishlist"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-2 sm:p-4">
                                        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wide text-white group-hover:text-cloudsfit-purple transition mb-1 sm:mb-2 line-clamp-2">
                                            {product.name}
                                        </h3>

                                        {/* Rating */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex text-yellow-400">
                                                {[...Array(Math.floor(product.rating || 0))].map((_, i) => (
                                                    <span key={i} className="text-xs">★</span>
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-400">({product.reviews || 0})</span>
                                        </div>

                                        <p className="text-sm sm:text-lg font-bold text-cloudsfit-blue">
                                            {product.price}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-24 h-24 bg-neutral-800/50 rounded-full flex items-center justify-center mb-8">
                                <Heart className="w-12 h-12 text-gray-600" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight mb-3">
                                Your Wishlist is Empty
                            </h2>
                            <p className="text-gray-400 mb-8 max-w-sm">
                                Start saving your favorite products by clicking the heart icon. Build your perfect collection!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/shop"
                                    className="px-8 py-3 bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue text-white font-bold rounded-lg hover:opacity-90 transition"
                                >
                                    Continue Shopping
                                </Link>
                                <Link
                                    href="/best-sellers"
                                    className="px-8 py-3 border-2 border-cloudsfit-purple text-cloudsfit-purple rounded-lg hover:bg-cloudsfit-purple/10 transition font-bold"
                                >
                                    View Best Sellers
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}
