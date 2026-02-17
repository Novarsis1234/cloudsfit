"use client";

import { useState } from "react";
import { ChevronDown, Heart } from "lucide-react";
import Link from "next/link";
import { getProductsByCollection } from "@/lib/productsData";
import { useWishlist } from "@/lib/context/wishlist-context";

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
  const [priceRange, setPriceRange] = useState(5000);
  const { inWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlist();

  // Get real products from data
  const allProducts = getProductsByCollection(collection.handle);

  // Filter and sort products
  const filteredProducts = allProducts
    .filter((product) => {
      // Price filter
      const productPrice = parseInt(product.price.replace(/[₹,]/g, ""));
      if (productPrice > priceRange) return false;

      // Size filter
      if (selectedSizes.length > 0) {
        const hasSize = selectedSizes.some((size) =>
          product.sizes.includes(size)
        );
        if (!hasSize) return false;
      }

      // Color filter
      if (selectedColors.length > 0) {
        const hasColor = selectedColors.some((color) =>
          product.colors.includes(color)
        );
        if (!hasColor) return false;
      }

      return true;
    })
    .sort((a, b) => {
      const priceA = parseInt(a.price.replace(/[₹,]/g, ""));
      const priceB = parseInt(b.price.replace(/[₹,]/g, ""));

      if (sortBy === "Price Low to High") return priceA - priceB;
      if (sortBy === "Price High to Low") return priceB - priceA;
      // Newest (default) - assumes products with higher ids are newer
      return b.id - a.id;
    });

  const sizes = ["S", "M", "L", "XL", "XXL"];
  const colors = [
    "Black",
    "Black Wash",
    "Blue",
    "Blue Wash",
    "Charcoal",
    "Gray",
    "Gray Wash",
    "Green",
    "Navy",
    "Orange",
    "Pink Wash",
    "Purple",
    "Purple Wash",
    "Red",
    "White",
  ];

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Collection Header Section */}
      <div className="relative bg-gradient-to-r from-purple-900/20 via-black to-teal-900/20 py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-2 sm:mb-4">
            <span className="text-cloudsfit-purple text-xs sm:text-sm font-bold tracking-widest uppercase">
              🔵 SHOP COLLECTION
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 sm:mb-4 tracking-tight uppercase">
            {collection.title}
          </h1>

          {/* Description */}
          {collection.description && (
            <p className="text-gray-400 text-sm sm:text-base md:text-lg">{collection.description}</p>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
            {/* Filters Sidebar */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="space-y-4 sm:space-y-6">
                {/* Price Range */}
                <div className="border border-neutral-800 rounded-lg p-3 sm:p-4">
                  <button className="w-full flex items-center justify-between text-left">
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-widest">
                      Price Range
                    </span>
                    <ChevronDown size={16} />
                  </button>
                  <div className="mt-3 sm:mt-4 space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      value={priceRange}
                      onChange={(e) => setPriceRange(parseInt(e.target.value))}
                      className="w-full accent-cloudsfit-purple"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>₹0</span>
                      <span>₹{priceRange}</span>
                    </div>
                  </div>
                </div>

                {/* Size Filter */}
                <div className="border border-neutral-800 rounded-lg p-3 sm:p-4">
                  <button className="w-full flex items-center justify-between text-left">
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-widest">
                      Size
                    </span>
                    <ChevronDown size={16} />
                  </button>
                  <div className="mt-3 sm:mt-4 grid grid-cols-5 gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() =>
                          setSelectedSizes((prev) =>
                            prev.includes(size)
                              ? prev.filter((s) => s !== size)
                              : [...prev, size]
                          )
                        }
                        className={`py-2 text-xs font-bold border rounded transition ${
                          selectedSizes.includes(size)
                            ? "border-cloudsfit-purple bg-cloudsfit-purple/20"
                            : "border-neutral-700 hover:border-cloudsfit-purple"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Filter */}
                <div className="border border-neutral-800 rounded-lg p-3 sm:p-4">
                  <button className="w-full flex items-center justify-between text-left">
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-widest">
                      Color
                    </span>
                    <ChevronDown size={16} />
                  </button>
                  <div className="mt-3 sm:mt-4 space-y-2">
                    {colors.map((color) => (
                      <label
                        key={color}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedColors.includes(color)}
                          onChange={(e) =>
                            setSelectedColors((prev) =>
                              e.target.checked
                                ? [...prev, color]
                                : prev.filter((c) => c !== color)
                            )
                          }
                          className="w-4 h-4 accent-cloudsfit-purple"
                        />
                        <span className="text-xs text-gray-300 group-hover:text-gray-100 transition">
                          {color}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Sort Bar */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-neutral-800">
                <span className="text-sm text-gray-400">
                  {filteredProducts.length} products found
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-neutral-900 border border-neutral-800 text-white text-xs px-3 py-2 rounded cursor-pointer"
                  >
                    <option>Newest</option>
                    <option>Price Low to High</option>
                    <option>Price High to Low</option>
                  </select>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/collections/${collection.handle}/products/${product.id}`}
                      className="group border border-neutral-800 rounded-lg overflow-hidden hover:border-cloudsfit-purple/50 transition"
                    >
                      {/* Product Image */}
                      <div className="relative aspect-square bg-neutral-900 overflow-hidden">
                        <img
                          src={product.image || product.images?.[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
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
                                handle: collection.handle,
                              } as any);
                            }
                          }}
                          className={`absolute top-2 sm:top-4 right-2 sm:right-4 w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition flex-shrink-0 ${
                            inWishlist(`${product.id}`)
                              ? "bg-red-500/80"
                              : "bg-neutral-800/80 hover:bg-neutral-700"
                          }`}
                        >
                          <Heart
                            size={16}
                            className={`sm:w-5 sm:h-5 ${
                              inWishlist(`${product.id}`) ? "fill-white" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className="p-2 sm:p-4">
                        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wide text-white group-hover:text-cloudsfit-purple transition mb-1 sm:mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-sm sm:text-lg font-bold text-cloudsfit-blue">
                          {product.price}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-3 xl:col-span-4 py-20 text-center">
                    <p className="text-gray-400 text-lg mb-4">No products found matching your filters</p>
                    <button
                      onClick={() => {
                        setSelectedSizes([]);
                        setSelectedColors([]);
                        setPriceRange(5000);
                      }}
                      className="px-6 py-2 bg-cloudsfit-purple rounded-lg hover:opacity-90 transition text-sm font-semibold"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
