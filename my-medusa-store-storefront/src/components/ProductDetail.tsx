"use client";

import { useState } from "react";
import { Heart, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProductsByCollection } from "@/lib/productsData";
import { useCart } from "@/lib/context/cart-context";
import { useWishlist } from "@/lib/context/wishlist-context";
import { Toaster, toast } from "sonner";

interface ProductDetailProps {
  product: any;
  collectionHandle: string;
}

export default function ProductDetail({
  product,
  collectionHandle,
}: ProductDetailProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, inWishlist } = useWishlist();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(inWishlist(String(product.id)));
  const [showShareMenu, setShowShareMenu] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
      color: selectedColor,
      size: selectedSize,
    };
    addItem(cartItem);
    toast.success("Added to cart", {
      description: `${product.name} x${quantity} added to your cart 🛒`,
    });
    setTimeout(() => {
      router.push("/cart");
    }, 500);
  };

  const handleBuyNow = () => {
    toast.success("Redirecting to checkout", {
      description: `Processing your order for ${product.name}...`,
    });
    setTimeout(() => {
      handleAddToCart();
    }, 500);
  };

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(String(product.id));
      setIsWishlisted(false);
      toast.error("Removed from wishlist", {
        description: `${product.name} removed from your wishlist`,
      });
    } else {
      addToWishlist(product);
      setIsWishlisted(true);
      toast.success("Added to wishlist", {
        description: `${product.name} saved to your wishlist ❤️`,
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on CloudsFit`,
        url: window.location.href,
      });
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
    setShowShareMenu(false);
  };

  const shareOnWhatsApp = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out ${product.name} on CloudsFit`);
    window.open(`https://wa.me/?text=${text}%20${url}`, "_blank");
    setShowShareMenu(false);
  };

  const shareOnTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out ${product.name} on CloudsFit`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
    setShowShareMenu(false);
  };

  const getCollectionName = () => {
    const names: Record<string, string> = {
      "regular-tees": "Regular Tees",
      "oversized-tees": "Oversized Tees",
      "acid-wash": "Acid Wash",
      hoodies: "Oversized Hoodies",
      sweatshirts: "Sweatshirts",
    };
    return names[collectionHandle] || "Collection";
  };

  return (
    <div className="bg-black min-h-screen text-white pt-4 sm:pt-6 pb-16">
      <Toaster position="top-center" theme="dark" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 sm:mb-8 text-xs sm:text-sm overflow-x-auto pb-2">
          <Link href="/" className="text-gray-400 hover:text-white whitespace-nowrap">
            Home
          </Link>
          <span className="text-gray-600">›</span>
          <Link
            href={`/collections/${collectionHandle}`}
            className="text-cloudsfit-purple hover:text-cloudsfit-blue whitespace-nowrap"
          >
            {getCollectionName()}
          </Link>
          <span className="text-gray-600">›</span>
          <span className="text-cloudsfit-purple line-clamp-1">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16">
          {/* Product Images - Left */}
          <div className="flex flex-col gap-3 sm:gap-4 order-2 lg:order-1">
            {/* Main Image */}
            <div className="relative aspect-square bg-neutral-800 rounded-lg overflow-hidden">
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-neutral-700/80 hover:bg-neutral-600 p-2 sm:p-3 rounded-full transition"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-neutral-700/80 hover:bg-neutral-600 p-2 sm:p-3 rounded-full transition"
                aria-label="Next image"
              >
                <ChevronRight size={20} className="sm:w-6 sm:h-6" />
              </button>

              {/* Wishlist Button */}
              <button 
                onClick={handleToggleWishlist}
                className={`absolute top-4 right-4 rounded-full p-2 sm:p-3 transition ${
                  isWishlisted 
                    ? "bg-red-500/80 hover:bg-red-600" 
                    : "bg-neutral-700 hover:bg-neutral-600"
                }`}
              >
                <Heart size={18} className={`sm:w-5 sm:h-5 ${isWishlisted ? "fill-white" : ""}`} />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-neutral-800/90 px-3 py-1 rounded text-xs">
                {currentImageIndex + 1} / {product.images.length}
              </div>
            </div>

            {/* Thumbnail Images - Scrollable */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`min-w-[60px] sm:min-w-[80px] h-[60px] sm:h-[80px] rounded border-2 overflow-hidden transition flex-shrink-0 ${
                    currentImageIndex === idx
                      ? "border-cloudsfit-purple"
                      : "border-neutral-700 hover:border-neutral-600"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details - Right */}
          <div className="flex flex-col gap-4 sm:gap-6 order-1 lg:order-2">
            {/* Badges */}
            <div className="flex gap-2 flex-wrap">
              {product.badges.map((badge: string) => (
                <span
                  key={badge}
                  className="px-2 sm:px-3 py-1 bg-cloudsfit-purple/20 border border-cloudsfit-purple text-cloudsfit-purple text-xs font-bold rounded"
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Subtitle */}
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg">{product.description}</p>

            {/* Rating */}
            <div className="flex items-center gap-3 text-sm sm:text-base">
              <div className="flex text-base sm:text-lg">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < Math.floor(product.rating)
                        ? "text-yellow-400"
                        : "text-gray-600"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-gray-400 text-xs sm:text-sm">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-cloudsfit-blue">
              {product.price}
            </div>

            {/* Quick Highlights */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 sm:p-4">
              <h3 className="text-cloudsfit-purple font-bold mb-3 uppercase text-xs sm:text-sm">
                Quick Highlights
              </h3>
              <ul className="space-y-1 sm:space-y-2">
                {product.highlights.map((highlight: string) => (
                  <li key={highlight} className="flex items-center gap-2 text-xs sm:text-sm">
                    <span className="text-cloudsfit-purple flex-shrink-0">✓</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-xs sm:text-sm font-bold uppercase mb-2 sm:mb-3">
                Color: {selectedColor}
              </label>
              <div className="flex gap-2 sm:gap-3 flex-wrap">
                {product.colors.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 transition flex-shrink-0 ${
                      selectedColor === color
                        ? "border-cloudsfit-purple"
                        : "border-neutral-700"
                    }`}
                    title={color}
                  >
                    <div
                      className="w-full h-full rounded-full"
                      style={{
                        backgroundColor:
                          color === "Black"
                            ? "#000"
                            : color === "White"
                            ? "#fff"
                            : color === "Navy"
                            ? "#001f3f"
                            : color === "Gray"
                            ? "#808080"
                            : color === "Purple"
                            ? "#9d4edd"
                            : color === "Blue"
                            ? "#0096ff"
                            : "#666",
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-xs sm:text-sm font-bold uppercase mb-2 sm:mb-3">
                Size
              </label>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 sm:py-3 font-bold border-2 rounded text-xs sm:text-sm transition ${
                      selectedSize === size
                        ? "border-cloudsfit-purple bg-cloudsfit-purple/20"
                        : "border-neutral-700 hover:border-cloudsfit-purple"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs sm:text-sm font-bold uppercase mb-2 sm:mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-2 sm:gap-4 border border-neutral-700 w-fit rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 sm:px-4 py-2 sm:py-3 hover:bg-neutral-800 transition text-sm sm:text-base"
                >
                  −
                </button>
                <span className="px-3 sm:px-4 font-bold text-sm sm:text-base">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2 sm:px-4 py-2 sm:py-3 hover:bg-neutral-800 transition text-sm sm:text-base"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue py-2 sm:py-3 font-bold uppercase rounded-lg hover:opacity-90 transition text-xs sm:text-sm md:text-base"
              >
                🛒 Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="flex-1 border-2 border-orange-500 text-orange-500 py-2 sm:py-3 font-bold uppercase rounded-lg hover:bg-orange-500/10 transition text-xs sm:text-sm md:text-base"
              >
                ⚡ Buy Now
              </button>
              <div className="relative">
                <button 
                  onClick={handleShare}
                  className="w-full sm:w-auto border-2 border-cloudsfit-blue text-cloudsfit-blue px-3 sm:px-4 py-2 sm:py-3 font-bold uppercase rounded-lg hover:bg-cloudsfit-blue/10 transition text-xs sm:text-sm md:text-base"
                >
                  📤 Share
                </button>
                {showShareMenu && (
                  <div className="absolute top-full right-0 mt-2 bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg z-10">
                    <button
                      onClick={copyToClipboard}
                      className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-neutral-800 transition text-sm first:rounded-t-lg"
                    >
                      Copy Link
                    </button>
                    <button
                      onClick={shareOnWhatsApp}
                      className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-neutral-800 transition text-sm"
                    >
                      WhatsApp
                    </button>
                    <button
                      onClick={shareOnTwitter}
                      className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-neutral-800 transition text-sm last:rounded-b-lg"
                    >
                      Twitter
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-neutral-800">
              <div className="text-center">
                <div className="text-lg sm:text-2xl mb-1 sm:mb-2">🚚</div>
                <div className="text-xs text-gray-400">Free Shipping</div>
                <div className="text-xs font-bold">Orders ₹999+</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-2xl mb-1 sm:mb-2">↩️</div>
                <div className="text-xs text-gray-400">Easy Returns</div>
                <div className="text-xs font-bold">7 Days</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-2xl mb-1 sm:mb-2">🛡️</div>
                <div className="text-xs text-gray-400">Secure</div>
                <div className="text-xs font-bold">100% Safe</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="border-t border-neutral-800 pt-6 sm:pt-8">
          <div className="flex gap-4 sm:gap-6 mb-6 sm:mb-8 border-b border-neutral-800 overflow-x-auto pb-4">
            {["description", "specifications", "sizeGuide", "shipping"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-3 sm:px-4 uppercase font-bold text-xs sm:text-sm transition whitespace-nowrap ${
                  activeTab === tab
                    ? "text-cloudsfit-purple border-b-2 border-cloudsfit-purple"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab === "description"
                  ? "Description"
                  : tab === "specifications"
                  ? "Specifications"
                  : tab === "sizeGuide"
                  ? "Size Guide"
                  : "Shipping & Returns"}
              </button>
            ))}
          </div>

          <div className="bg-neutral-900/50 rounded-lg p-4 sm:p-6 md:p-8">
            {/* Description Tab */}
            {activeTab === "description" && (
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 uppercase">
                  Product Description
                </h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                  {product.description || "No description available."}
                </p>
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === "specifications" && (
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-6 uppercase">
                  Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-cloudsfit-purple font-bold mb-4 uppercase">Specification</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between border-b border-neutral-700 pb-2">
                        <span className="text-gray-300 font-semibold">Material</span>
                        <span className="text-gray-400">100% Premium Cotton</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-700 pb-2">
                        <span className="text-gray-300 font-semibold">Weight</span>
                        <span className="text-gray-400">240 GSM (Heavy Weight)</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-700 pb-2">
                        <span className="text-gray-300 font-semibold">Fit</span>
                        <span className="text-gray-400">Oversized / Drop Shoulder</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-700 pb-2">
                        <span className="text-gray-300 font-semibold">Collar</span>
                        <span className="text-gray-400">Ribbed Round Neck</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-cloudsfit-purple font-bold mb-4 uppercase">Details</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between border-b border-neutral-700 pb-2">
                        <span className="text-gray-300 font-semibold">Print Type</span>
                        <span className="text-gray-400">DTF (Direct to Film)</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-700 pb-2">
                        <span className="text-gray-300 font-semibold">Care</span>
                        <span className="text-gray-400">Machine Wash Cold, Tumble Dry Low</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-700 pb-2">
                        <span className="text-gray-300 font-semibold">Origin</span>
                        <span className="text-gray-400">Designed in India</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-700 pb-2">
                        <span className="text-gray-300 font-semibold">License</span>
                        <span className="text-gray-400">Official Merchandise</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Size Guide Tab */}
            {activeTab === "sizeGuide" && (
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 uppercase">
                  Size Guide
                </h3>
                <p className="text-gray-400 text-sm sm:text-base mb-6">All measurements are in inches. For the best fit, measure your favorite tee and compare.</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm sm:text-base">
                    <thead>
                      <tr className="border-b-2 border-cloudsfit-purple">
                        <th className="text-left py-3 px-2 sm:px-4 text-cloudsfit-purple font-bold">Size</th>
                        <th className="text-left py-3 px-2 sm:px-4 text-cloudsfit-purple font-bold">Chest</th>
                        <th className="text-left py-3 px-2 sm:px-4 text-cloudsfit-purple font-bold">Length</th>
                        <th className="text-left py-3 px-2 sm:px-4 text-cloudsfit-purple font-bold">Shoulder</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { size: "S", chest: '40"', length: '27"', shoulder: '20"' },
                        { size: "M", chest: '42"', length: '28"', shoulder: '21"' },
                        { size: "L", chest: '44"', length: '29"', shoulder: '22"' },
                        { size: "XL", chest: '46"', length: '30"', shoulder: '23"' },
                        { size: "XXL", chest: '48"', length: '31"', shoulder: '24"' },
                      ].map((row) => (
                        <tr key={row.size} className="border-b border-neutral-700 hover:bg-neutral-800/30 transition">
                          <td className="py-3 px-2 sm:px-4 font-semibold text-white">{row.size}</td>
                          <td className="py-3 px-2 sm:px-4 text-gray-400">{row.chest}</td>
                          <td className="py-3 px-2 sm:px-4 text-gray-400">{row.length}</td>
                          <td className="py-3 px-2 sm:px-4 text-gray-400">{row.shoulder}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Shipping & Returns Tab */}
            {activeTab === "shipping" && (
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-6 uppercase">
                  Shipping & Returns
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
                  {/* Shipping Section */}
                  <div className="border border-neutral-700 rounded-lg p-4 sm:p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-2xl">🚚</div>
                      <h4 className="text-lg font-bold uppercase text-white">Shipping</h4>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-cloudsfit-purple font-bold text-sm mb-1">Free Shipping</h5>
                        <p className="text-gray-400 text-sm">On all orders above ₹999</p>
                      </div>
                      <div>
                        <h5 className="text-cloudsfit-purple font-bold text-sm mb-1">Delivery Time</h5>
                        <p className="text-gray-400 text-sm">Metro cities: 3-5 business days</p>
                        <p className="text-gray-400 text-sm">Other areas: 5-7 business days</p>
                      </div>
                      <div>
                        <h5 className="text-cloudsfit-purple font-bold text-sm mb-1">Track Your Order</h5>
                        <p className="text-gray-400 text-sm">Tracking link sent via SMS & email</p>
                      </div>
                    </div>
                  </div>

                  {/* Returns Section */}
                  <div className="border border-neutral-700 rounded-lg p-4 sm:p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-2xl">↩️</div>
                      <h4 className="text-lg font-bold uppercase text-white">Returns & Exchange</h4>
                    </div>
                    <div className="space-y-2 text-sm text-gray-400">
                      <p>We want you to love your purchase! If it doesn't work out:</p>
                      <ul className="space-y-1 ml-4">
                        <li>✓ 7-day easy return policy</li>
                        <li>✓ Free size exchange on first order</li>
                        <li>✓ Items must be unworn with tags attached</li>
                        <li>✓ Refund processed within 5-7 business days</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Quality Guarantee */}
                <div className="border border-cloudsfit-purple/30 rounded-lg p-4 sm:p-6 bg-cloudsfit-purple/5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-2xl mt-1">🛡️</div>
                    <div>
                      <h4 className="text-lg font-bold uppercase text-white mb-2">Quality Guarantee</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        We stand behind the quality of our products. If you receive a damaged or defective item, we'll replace it at no extra cost. Our prints are guaranteed not to crack or peel for at least 50 washes when cared for properly. If you experience any quality issues within 30 days of purchase, reach out to our support team for a hassle-free resolution.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-12 sm:mt-16 border-t border-neutral-800 pt-8 sm:pt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase">
              Customer Reviews
            </h2>
            <div className="text-xs sm:text-sm text-gray-400">
              Showing {product.reviews} of {product.reviews} reviews
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8">
            {/* Reviews Summary */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-extrabold text-cloudsfit-blue mb-2">
                  {product.rating}
                </div>
                <div className="flex justify-center text-base sm:text-lg mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-600"}>
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-400 text-sm">Based on {product.reviews} reviews</p>
              </div>
              <div className="mt-6 space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-10">{stars} star</span>
                    <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue"
                        style={{ width: `${Math.random() * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-8">0</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            <div className="md:col-span-2 bg-neutral-900 border border-neutral-800 rounded-lg p-6">
              <p className="text-gray-400 text-center py-12">
                ✨ No reviews yet. Be the first to review!
              </p>
              <div className="text-center">
                <button className="px-8 py-3 bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue text-white font-bold rounded-lg hover:opacity-90 transition uppercase text-sm">
                  Write a Review
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-12 sm:mt-16 lg:mt-20 pt-8 sm:pt-12 border-t border-neutral-800">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight">
              You May Also Like
            </h2>
            <Link
              href={`/collections/${collectionHandle}`}
              className="text-cloudsfit-purple hover:text-cloudsfit-blue text-xs sm:text-sm font-bold uppercase transition flex items-center gap-2"
            >
              View All <span>›</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {getProductsByCollection(collectionHandle)
              .filter((p: any) => p.id !== product.id)
              .slice(0, 4)
              .map((relatedProduct: any) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.id}`}
                  className="group border border-neutral-800 rounded-lg overflow-hidden hover:border-cloudsfit-purple/50 transition"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-neutral-900 overflow-hidden">
                    <img
                      src={relatedProduct.image || relatedProduct.images?.[0]}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    {/* Wishlist Button */}
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        if (inWishlist(relatedProduct.id)) {
                          removeFromWishlist(relatedProduct.id);
                        } else {
                          addToWishlist(relatedProduct);
                        }
                      }}
                      className={`absolute top-2 sm:top-4 right-2 sm:right-4 w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition flex-shrink-0 ${
                        inWishlist(relatedProduct.id)
                          ? "bg-red-500/80 hover:bg-red-600"
                          : "bg-neutral-800/80 hover:bg-neutral-700"
                      }`}
                    >
                      <Heart size={16} className={`sm:w-5 sm:h-5 ${inWishlist(relatedProduct.id) ? "fill-white" : ""}`} />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-2 sm:p-4">
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wide text-white group-hover:text-cloudsfit-purple transition mb-1 sm:mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-sm sm:text-lg font-bold text-cloudsfit-blue">
                        {relatedProduct.price}
                      </p>
                      <div className="flex text-xs text-yellow-400">
                        {[...Array(Math.floor(relatedProduct.rating || 0))].map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
