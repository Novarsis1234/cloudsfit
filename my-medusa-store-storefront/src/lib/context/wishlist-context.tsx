"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"

interface WishlistContextType {
    items: HttpTypes.StoreProduct[]
    addItem: (item: HttpTypes.StoreProduct) => void
    removeItem: (itemId: string) => void
    inWishlist: (itemId: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export const useWishlist = () => {
    const context = useContext(WishlistContext)
    if (!context) {
        throw new Error("useWishlist must be used within a WishlistProvider")
    }
    return context
}

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState<HttpTypes.StoreProduct[]>([])
    const [isInitialized, setIsInitialized] = useState(false)

    useEffect(() => {
        const savedItems = localStorage.getItem("cloudsfit_wishlist")
        if (savedItems) {
            try {
                setItems(JSON.parse(savedItems))
            } catch (e) {
                console.error("Failed to parse wishlist", e)
            }
        }
        setIsInitialized(true)
    }, [])

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("cloudsfit_wishlist", JSON.stringify(items))
        }
    }, [items, isInitialized])

    const addItem = (item: HttpTypes.StoreProduct | any) => {
        setItems((prev) => {
            const itemIdStr = String(item.id);
            if (prev.some((i) => String(i.id) === itemIdStr)) return prev;
            return [...prev, item];
        });
    };

    const removeItem = (itemId: string) => {
        setItems((prev) => prev.filter((i) => String(i.id) !== itemId));
    };

    const inWishlist = (itemId: string) => {
        return items.some((i) => String(i.id) === itemId);
    };

    return (
        <WishlistContext.Provider value={{ items, addItem, removeItem, inWishlist }}>
            {children}
        </WishlistContext.Provider>
    )
}
