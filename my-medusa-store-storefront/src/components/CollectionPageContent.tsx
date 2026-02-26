"use client";
import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { getProducts } from "@/lib/medusa/get-products";
import { MedusaProduct } from "@/lib/medusa/mappers";
import ProductCard from "./ProductCard";

interface CollectionPageContentProps {
  collection: {
    title: string;
    description: string;
    handle: string;
  };
}

export default function CollectionPageContent({
  collection,
}: CollectionPageContentProps) {
  const [sortBy, setSortBy] = useState("Newest");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState(10000);
  const [allProducts, setAllProducts] = useState<MedusaProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const prods = await getProducts(collection.handle);
      setAllProducts(prods);
      setLoading(false);
    }
    fetchProducts();
  }, [collection.handle]);

  if (loading) return (
    <div className="bg-black min-h-screen py-20 text-center text-white">
      <div className="animate-pulse">Loading Collection...</div>
    </div>
  );

  // Filter and sort products
  const filteredProducts = allProducts
    .filter((product) => {
      // Price filter
      const priceNum = parseInt(product.price.replace(/[^0-9]/g, "")) || 0;
      if (priceNum > priceRange && product.price !== "Price on Request") return false;

      // Size filter (if we have real size data, for now we have mocks in mapper)
      if (selectedSizes.length > 0) {
        const hasSize = selectedSizes.some((size) => product.sizes.includes(size));
        if (!hasSize) return false;
      }

      // Color filter
      if (selectedColors.length > 0) {
        const hasColor = selectedColors.some((color) => product.colors.includes(color));
        if (!hasColor) return false;
      }

      return true;
    })
    .sort((a, b) => {
      const priceA = parseInt(a.price.replace(/[^0-9]/g, "")) || 0;
      const priceB = parseInt(b.price.replace(/[^0-9]/g, "")) || 0;

      if (sortBy === "Price Low to High") return priceA - priceB;
      if (sortBy === "Price High to Low") return priceB - priceA;
      return 0; // Default newest (logic depends on ID or date which we might not have sorted from API)
    });

  const sizes = ["S", "M", "L", "XL", "XXL"];
  const colors = ["Black", "White", "Navy", "Gray", "Purple", "Green", "Orange", "Red"];

  return (
    <div className="bg-black min-h-screen text-white pb-20">
      {/* Header */}
      <div className="relative bg-neutral-900/30 border-b border-neutral-900 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <span className="text-cloudsfit-purple text-xs font-bold tracking-widest uppercase mb-4 block">
            🔵 EXPLORE COLLECTION
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight uppercase">
            {collection.title}
          </h1>
          {collection.description && (
            <p className="text-gray-400 text-lg max-w-2xl">{collection.description}</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <div className="w-full lg:w-64 space-y-8">
            {/* Price Filter */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center justify-between">
                Price Range <ChevronDown size={14} />
              </h3>
              <input
                type="range"
                min="0"
                max="10000"
                step="500"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full accent-cloudsfit-purple"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
                <span>₹0</span>
                <span>₹{priceRange}</span>
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Size</h3>
              <div className="grid grid-cols-5 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])}
                    className={`h-10 text-[10px] font-bold border rounded transition-all ${selectedSizes.includes(size) ? "border-cloudsfit-purple bg-cloudsfit-purple/10 text-cloudsfit-purple" : "border-neutral-800 text-gray-400 hover:border-neutral-600"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Color</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {colors.map((color) => (
                  <label key={color} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(color)}
                      onChange={(e) => setSelectedColors(prev => e.target.checked ? [...prev, color] : prev.filter(c => c !== color))}
                      className="w-4 h-4 rounded border-neutral-800 bg-neutral-900 checked:bg-cloudsfit-purple focus:ring-cloudsfit-purple transition-all"
                    />
                    <span className="text-xs text-gray-400 group-hover:text-white transition-colors">{color}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Grid Area */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-neutral-900">
              <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">
                Showing <span className="text-white">{filteredProducts.length}</span> Products
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 text-[10px] font-bold uppercase px-4 py-2 rounded focus:outline-none focus:border-cloudsfit-purple transition-colors"
              >
                <option>Newest</option>
                <option>Price Low to High</option>
                <option>Price High to Low</option>
              </select>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} collectionHandle={collection.handle} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-gray-500 text-lg mb-6">No products found matching your filters.</p>
                <button
                  onClick={() => { setSelectedSizes([]); setSelectedColors([]); setPriceRange(10000); }}
                  className="px-8 py-3 bg-cloudsfit-purple text-white font-bold rounded uppercase tracking-widest hover:bg-opacity-90 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
