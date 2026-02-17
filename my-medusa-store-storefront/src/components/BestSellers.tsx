"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { productsData } from "@/lib/productsData";
import { useWishlist } from "@/lib/context/wishlist-context";
import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";

export default function BestSellers() {
  const { addItem, removeItem, items, inWishlist } = useWishlist();
  const [mounted, setMounted] = useState(false);
  const [wishlistUpdated, setWishlistUpdated] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Force re-render when wishlist items change
  useEffect(() => {
    setWishlistUpdated(prev => prev + 1);
  }, [items]);

  // Get bestseller products - using products with "Bestseller" badge
  const bestSellerProducts = [
    { product: productsData["oversized-tees"][0], collection: "oversized-tees" },
    { product: productsData["hoodies"][0], collection: "hoodies" },
    { product: productsData["sweatshirts"][0], collection: "sweatshirts" },
    { product: productsData["sweatshirts"][1], collection: "sweatshirts" },
  ];

  const toggleWishlist = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    const productIdStr = String(product.id);
    
    if (inWishlist(productIdStr)) {
      removeItem(productIdStr);
      toast.error("Removed from wishlist", {
        description: `${product.name} has been removed`,
      });
    } else {
      addItem(product);
      toast.success("Added to wishlist", {
        description: `${product.name} saved to your wishlist ❤️`,
      });
    }
  };

  return (
    <section id="best-sellers" className="py-20 bg-black text-white">
      <Toaster position="top-center" theme="dark" />
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-orange-500 text-sm font-bold tracking-widest uppercase">
            🔥 MOST POPULAR
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-2 tracking-tight">
            BEST SELLERS
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {bestSellerProducts.map(({ product, collection }, i) => {
            const isWishlisted = mounted && inWishlist(String(product.id));
            return (
            <Link
              key={i}
              href={`/collections/${collection}/products/${product.id}`}
              className="bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 hover:border-cloudsfit-purple/50 transition group cursor-pointer"
            >
              {/* Product Image */}
              <div className="relative aspect-square flex items-center justify-center overflow-hidden bg-neutral-800">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {product.badges.includes("Bestseller") && (
                    <div className="bg-cloudsfit-blue text-white text-xs font-bold px-2 py-1 rounded">
                      FEATURED
                    </div>
                  )}
                </div>

                {product.badges.includes("Limited Edition") && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">
                    LIMITED
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={(e) => toggleWishlist(e, product)}
                  className="absolute bottom-4 left-4 w-8 h-8 bg-gray-800 hover:bg-cloudsfit-purple rounded-full flex items-center justify-center transition"
                >
                  <Heart size={16} fill={isWishlisted ? "#ec4899" : "none"} stroke={isWishlisted ? "#ec4899" : "white"} />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-sm font-bold tracking-tight uppercase text-white mb-2 line-clamp-2 group-hover:text-cloudsfit-purple transition">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-cloudsfit-blue font-bold text-lg">{product.price}</span>
                  {product.rating && (
                    <span className="text-xs text-yellow-500">★ {product.rating}</span>
                  )}
                </div>
              </div>
            </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/best-sellers" className="inline-block px-8 py-3 border-2 border-cloudsfit-purple text-cloudsfit-purple font-bold tracking-wider uppercase hover:bg-cloudsfit-purple/10 transition rounded">
            VIEW ALL BEST SELLERS
          </Link>
        </div>
      </div>
    </section>
  );
}
