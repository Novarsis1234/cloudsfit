"use client"

import { useCart } from "@/lib/context/cart-context"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { syncCart as syncWithMedusa } from "@/lib/data/cart"

export default function ContextCart() {
    const { items, removeItem, updateQuantity } = useCart()
    const [isSyncing, setIsSyncing] = useState(false)
    const router = useRouter()

    if (items.length === 0) return null

    const handleCheckout = async () => {
        setIsSyncing(true)
        try {
            // Sync all items from localStorage to Medusa backend in one server action call
            const syncItems = items.map(item => ({
                variantId: item.variantId,
                quantity: item.quantity
            }))

            console.log(`[ContextCart] Syncing ${syncItems.length} items to Medusa...`)
            await syncWithMedusa(syncItems, "in")

            router.push("/checkout")
        } catch (error) {
            console.error("[ContextCart] Sync failed:", error)
            // Even if sync fails, try to go to checkout
            router.push("/checkout")
        } finally {
            setIsSyncing(false)
        }
    }

    const parsePrice = (price: any) => {
        const p = parseFloat(price?.toString().replace(/[^0-9.]/g, "") || "0")
        return isNaN(p) ? 0 : p
    }

    const subtotal = items.reduce((total, item) => {
        return total + parsePrice(item.price) * item.quantity
    }, 0)

    return (
        <div className="bg-neutral-900/50 backdrop-blur-xl border border-cloudsfit-purple/20 p-6 sm:p-8 rounded-3xl mb-12 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue bg-clip-text text-transparent">
                    Shopping Cart
                </h2>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500 bg-neutral-800 px-3 py-1 rounded-full">
                    {items.length} {items.length === 1 ? 'Item' : 'Items'}
                </span>
            </div>

            <div className="space-y-6">
                {items.map((item, index) => (
                    <div key={`context-cart-item-${item.variantId}-${index}`} className="flex flex-col sm:flex-row gap-6 bg-neutral-800/30 p-4 rounded-2xl border border-white/5 hover:border-cloudsfit-blue/30 transition-all group">
                        <div className="relative w-full sm:w-24 h-48 sm:h-24 bg-neutral-800 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                            {item.image ? (
                                <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-600">No img</div>
                            )}
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-white group-hover:text-cloudsfit-blue transition-colors">{item.name}</h3>
                                {item.description && (
                                    <p className="text-xs text-gray-400 mt-1 line-clamp-1 max-w-[250px]">
                                        {item.description}
                                    </p>
                                )}
                                {((item.color && item.color !== "Default") || (item.size && item.size !== "Default")) && (
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-2">
                                        {item.color !== "Default" ? item.color : ""}
                                        {item.color !== "Default" && item.size !== "Default" ? <span className="mx-2 opacity-30">|</span> : ""}
                                        {item.size !== "Default" ? item.size : ""}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-4 mt-4 sm:mt-0">
                                <div className="flex items-center bg-black/40 border border-white/10 rounded-lg p-1">
                                    <button
                                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                        className="w-8 h-8 flex items-center justify-center text-white hover:bg-neutral-800 rounded-md transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="text-sm font-bold w-8 text-center text-white">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                        className="w-8 h-8 flex items-center justify-center text-white hover:bg-neutral-800 rounded-md transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={() => removeItem(item.variantId)}
                                    className="text-red-500/70 hover:text-red-400 text-xs font-bold uppercase tracking-widest transition-colors ml-auto sm:ml-0"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>

                        <div className="text-right flex flex-col justify-center border-t sm:border-t-0 sm:border-l border-white/5 pt-4 sm:pt-0 sm:pl-6 min-w-[100px]">
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Total</p>
                            <p className="text-xl font-black text-white">
                                ₹{(parsePrice(item.price) * item.quantity).toLocaleString('en-IN')}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="text-center sm:text-left">
                    <span className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">Estimated Subtotal</span>
                    <span className="text-3xl font-black text-white italic tracking-tighter">
                        ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                </div>
                <button
                    onClick={handleCheckout}
                    disabled={isSyncing}
                    className="w-full sm:w-auto bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue text-white font-black uppercase tracking-widest text-xs px-10 py-4 rounded-xl hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.5)] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                    {isSyncing ? "Preparing Checkout..." : "Secure Checkout"}
                </button>
            </div>
        </div>
    )
}
