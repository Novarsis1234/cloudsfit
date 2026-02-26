"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { useWishlist } from "@/lib/context/wishlist-context";
import { useCart } from "@/lib/context/cart-context";
import { toast } from "sonner";
import { MedusaProduct } from "@/lib/medusa/mappers";
import { useAccount } from "@/lib/context/account-context";
import { addToCart as addToMedusaCart } from "@/lib/data/cart";
import { useRouter } from "next/navigation";

interface ProductCardProps {
    product: MedusaProduct;
    collectionHandle?: string;
}

export default function ProductCard({ product, collectionHandle }: ProductCardProps) {
    const { addItem: addToWishlist, removeItem: removeFromWishlist, inWishlist } = useWishlist();
    const { addItem: addToCart } = useCart();
    const { customer } = useAccount();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!customer) {
            toast.error("Please sign in", {
                description: "You need to be signed in to usage wishlist",
                action: {
                    label: "Sign In",
                    onClick: () => router.push("/account"),
                },
            });
            return;
        }

        if (inWishlist(product.id)) {
            removeFromWishlist(product.id);
            toast.error("Removed from wishlist");
        } else {
            addToWishlist(product as any);
            toast.success("Added to wishlist ❤️");
        }
    };

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!customer) {
            toast.error("Please sign in", {
                description: "You need to be signed in to add items to cart",
                action: {
                    label: "Sign In",
                    onClick: () => router.push("/account"),
                },
            });
            return;
        }

        // Default to first variant if available
        const firstVariant = product.variants?.[0];
        const variantId = firstVariant?.id || product.id;

        // 1. Update Local UI Cart (Optimistic/Immediate)
        addToCart({
            id: product.id,
            variantId: variantId,
            name: product.name,
            description: product.description,
            price: firstVariant?.price || product.price,
            image: product.image,
            quantity: 1,
            color: firstVariant?.color || "Default",
            size: firstVariant?.size || "Default",
        });

        // 2. Sync with Medusa Backend
        try {
            const countryCode = "in" // Default to India as per project requirements
            await addToMedusaCart({
                variantId: variantId,
                quantity: 1,
                countryCode,
            })
            toast.success(`${product.name} added to cart! 🛍️`);
        } catch (error) {
            console.error("Failed to sync with Medusa:", error)
            // Even if backend fails, we show success because local cart is updated, 
            // but in a real app we might want to handle this better.
            toast.success(`${product.name} added to local cart!`);
        }
    };

    const isInWishlist = mounted && inWishlist(product.id);

    // Use the provided collection handle or fall back to the one on the product
    const activeHandle = collectionHandle || product.collection?.handle || "shop";
    const productUrl = `/collections/${activeHandle}/products/${product.id}`;

    return (
        <div className="group bg-[#0f0f12] rounded-lg overflow-hidden border border-neutral-800 hover:border-cloudsfit-purple/50 transition-all duration-300 flex flex-col h-full">
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden bg-neutral-900 block group/image">
                <Link href={productUrl} className="w-full h-full block">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover/image:scale-110 transition-transform duration-500"
                    />
                </Link>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                    {product.badges.map((badge, i) => (
                        <span key={i} className={`text-[10px] font-black px-2 py-1 rounded-sm uppercase tracking-wider ${badge === "NEW" ? "bg-cloudsfit-blue text-white" :
                            badge === "Bestseller" ? "bg-cloudsfit-purple text-white" :
                                "bg-neutral-800 text-gray-300"
                            }`}>
                            {badge}
                        </span>
                    ))}
                </div>

                {/* Persistent Wishlist Button - Top Right */}
                <button
                    onClick={handleWishlist}
                    className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md border border-white/10 ${isInWishlist ? "bg-red-500 text-white border-red-400" : "bg-black/40 text-white hover:bg-black/60"
                        }`}
                >
                    <Heart size={18} className={isInWishlist ? "fill-current" : ""} />
                </button>
            </div>

            {/* Product Info */}
            <div className="p-5 flex flex-col flex-grow min-h-[140px]">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <Link href={productUrl} className="flex-1">
                        <h3 className="text-sm font-black tracking-tighter uppercase text-white line-clamp-2 hover:text-cloudsfit-purple transition-colors">
                            {product.name}
                        </h3>
                    </Link>

                    {/* Add to Cart Icon - Trolley Style */}
                    <button
                        onClick={handleAddToCart}
                        className="w-9 h-9 flex-shrink-0 bg-cloudsfit-purple/10 text-cloudsfit-purple border border-cloudsfit-purple/20 rounded-lg flex items-center justify-center hover:bg-cloudsfit-purple hover:text-white transition-all duration-300 group/cart"
                        title="Add to Cart"
                    >
                        <ShoppingCart size={18} className="group-hover/cart:scale-110 transition-transform" />
                    </button>
                </div>

                <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className={`font-black tracking-tighter text-xl ${product.price === "Price on Request" ? "text-gray-500 text-sm" : "text-cloudsfit-blue"}`}>
                            {product.price}
                        </span>
                        {product.rating && (
                            <div className="flex items-center gap-1 mt-1">
                                <span className="text-yellow-500 text-xs">★</span>
                                <span className="text-gray-400 text-[10px] font-bold">{product.rating}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
