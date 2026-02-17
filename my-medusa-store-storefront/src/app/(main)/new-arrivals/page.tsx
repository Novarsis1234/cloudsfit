'use client';

import Link from 'next/link';
import { productsData, getProductsByCollection } from '@/lib/productsData';

export default function NewArrivalsPage() {
  // Combine all products from all collections
  const allProducts = Object.entries(productsData).flatMap(([handle, products]) =>
    products.map((p) => ({ ...p, collection: handle }))
  );

  return (
    <main className="bg-black min-h-screen text-white pt-0">
        {/* Header Section */}
        <section className="py-12 bg-gradient-to-r from-purple-900/20 via-black to-blue-900/20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <span className="text-cloudsfit-blue text-sm font-bold tracking-widest uppercase">
              ✨ JUST DROPPED
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight mt-4">
              NEW ARRIVALS
            </h1>
            <p className="text-gray-400">Check out our latest collection of anime and gaming inspired streetwear</p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {allProducts.map((product) => (
                <Link
                  key={`${product.collection}-${product.id}`}
                  href={`/collections/${product.collection}/products/${product.id}`}
                  className="group border border-neutral-800 rounded-lg overflow-hidden hover:border-cloudsfit-blue/50 transition"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-neutral-900 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    {/* NEW Badge */}
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                      <div className="bg-cloudsfit-blue text-white text-xs font-bold px-2 py-1 rounded">
                        NEW
                      </div>
                    </div>

                    {/* Wishlist Button */}
                    <button className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 w-7 h-7 sm:w-8 sm:h-8 bg-gray-800 hover:bg-cloudsfit-purple rounded-full flex items-center justify-center transition flex-shrink-0">
                      <svg
                        className="w-4 sm:w-5 h-4 sm:h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-3 sm:p-4">
                    <h3 className="text-xs sm:text-sm font-bold tracking-tight uppercase text-white group-hover:text-cloudsfit-blue transition mb-1 sm:mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-cloudsfit-blue font-bold text-sm sm:text-lg">{product.price}</span>
                      {product.rating && (
                        <span className="text-xs text-yellow-500">★ {product.rating}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
    </main>
  );
}
