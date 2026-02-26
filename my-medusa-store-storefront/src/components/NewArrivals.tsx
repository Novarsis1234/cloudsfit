"use client";

import Link from "next/link";
import { getProducts } from "@/lib/medusa/get-products";
import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import ProductCard from "./ProductCard";
import { MedusaProduct } from "@/lib/medusa/mappers";

export default function NewArrivals() {
  const [newArrivalProducts, setNewArrivalProducts] = useState<MedusaProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNewArrivals() {
      setLoading(true);
      const products = await getProducts("new-arrivals");
      setNewArrivalProducts(products);
      setLoading(false);
    }
    fetchNewArrivals();
  }, []);

  if (loading) return (
    <div className="py-20 bg-black text-white text-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-8 w-48 bg-neutral-800 rounded mb-4"></div>
        <div className="h-12 w-64 bg-neutral-800 rounded"></div>
      </div>
    </div>
  );

  if (!newArrivalProducts.length) return null;

  // Display only top 4
  const displayProducts = newArrivalProducts.slice(0, 4);

  return (
    <section id="new-arrivals" className="py-20 bg-black text-white border-t border-neutral-900">
      <Toaster position="top-center" theme="dark" />
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-cloudsfit-blue text-sm font-bold tracking-widest uppercase">
            ✨ JUST DROPPED
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-2 tracking-tight">
            NEW ARRIVALS
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              collectionHandle="new-arrivals"
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/new-arrivals" className="inline-block px-8 py-3 border-2 border-cloudsfit-purple text-cloudsfit-purple font-bold tracking-wider uppercase hover:bg-cloudsfit-purple hover:text-white transition-all rounded duration-300">
            VIEW ALL NEW ARRIVALS
          </Link>
        </div>
      </div>
    </section>
  );
}
