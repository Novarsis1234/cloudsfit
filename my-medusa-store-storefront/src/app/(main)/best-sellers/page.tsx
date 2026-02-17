'use client';

import Link from 'next/link';
import { productsData, getProductsByCollection } from '@/lib/productsData';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/lib/context/wishlist-context';

export default function BestSellersPage() {
  // Combine all products from all collections and sort by rating/reviews
  const allProducts = Object.entries(productsData)
    .flatMap(([handle, products]) =>
      products.map((p) => ({ ...p, collection: handle }))
    )
    .sort((a, b) => {
      // Sort by rating (descending), then by number of reviews (descending)
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.reviews - a.reviews;
    });

  const { inWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlist();

  return (
    <main className="bg-black min-h-screen text-white pt-0">
      {/* Header Section */}
      <section className="py-12 bg-gradient-to-r from-purple-900/20 via-black to-blue-900/20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-cloudsfit-blue text-sm font-bold tracking-widest uppercase">
            ⭐ TOP RATED
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight mt-4">
            BEST SELLERS
          </h1>
          <p className="text-gray-400">Our most loved products. Trusted by thousands of CloudsFit fans</p>
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
                className="group border border-neutral-800 rounded-lg overflow-hidden hover:border-cloudsfit-purple/50 transition"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-neutral-900 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  {/* Bestseller Badge */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                    <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                      BESTSELLER
                    </div>
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      const productId = `${product.id}`;
                      if (inWishlist(productId)) {
                        removeFromWishlist(productId);
                      } else {
                        addToWishlist({ 
                          id: productId,
                          title: product.name,
                          handle: product.collection
                        } as any);
                      }
                    }}
                    className={`absolute top-2 sm:top-4 right-2 sm:right-4 w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition flex-shrink-0 ${
                      inWishlist(`${product.id}`)
                        ? "bg-red-500/80"
                        : "bg-neutral-800/80 hover:bg-neutral-700"
                    }`}
                  >
                    <Heart size={16} className={`sm:w-5 sm:h-5 ${inWishlist(`${product.id}`) ? "fill-white" : ""}`} />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-2 sm:p-4">
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wide text-white group-hover:text-cloudsfit-purple transition mb-1 sm:mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(Math.floor(product.rating))].map((_, i) => (
                        <span key={i} className="text-xs">★</span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">({product.reviews})</span>
                  </div>

                  <p className="text-sm sm:text-base font-bold text-cloudsfit-blue">
                    {product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 uppercase">More Collections?</h2>
          <Link
            href="/shop"
            className="inline-block px-8 py-3 bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue text-white font-bold rounded-lg hover:opacity-90 transition"
          >
            EXPLORE ALL PRODUCTS
          </Link>
        </div>
      </section>
    </main>
  );
}
