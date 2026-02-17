"use client"

import { useCart } from "@/lib/context/cart-context"
import Link from "next/link"
import { Trash2, Plus, Minus } from "lucide-react"

export default function ContextCart() {
  const { items, removeItem, updateQuantity, itemCount } = useCart()

  const subtotal = items.reduce((total, item) => {
    const price = parseFloat(item.price.replace(/[^0-9.]/g, ""))
    return total + price * item.quantity
  }, 0)

  const shipping = subtotal > 999 ? 0 : 99
  const tax = Math.round(subtotal * 0.18)
  const total = subtotal + shipping + tax

  if (items.length === 0) {
    return (
      <div className="bg-black min-h-[70vh] text-white py-12 pt-6 md:pt-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-extrabold uppercase mb-8">Shopping Cart</h1>
          <div className="flex flex-col items-center justify-center py-20 text-center border border-neutral-800 rounded-lg">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold uppercase mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-8 max-w-sm">
              Looks like you haven't added any items yet. Start shopping to add items to your cart!
            </p>
            <Link
              href="/shop"
              className="px-8 py-3 bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue text-white font-bold rounded-lg hover:opacity-90 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen text-white py-8 pt-6 md:pt-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-extrabold uppercase mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="border border-neutral-800 rounded-lg overflow-hidden">
              <div className="bg-neutral-900 px-6 py-4 border-b border-neutral-800 flex justify-between items-center">
                <h2 className="font-bold uppercase text-lg">{itemCount} Items</h2>
                <p className="text-gray-400 text-sm">Item Details</p>
              </div>

              <div className="divide-y divide-neutral-800">
                {items.map((item) => (
                  <div key={item.id} className="px-6 py-4 flex gap-4">
                    <div className="w-20 h-20 bg-neutral-800 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold uppercase text-sm md:text-base mb-2">{item.name}</h3>
                      <div className="text-xs text-gray-400 mb-3 space-y-1">
                        <p>Color: <span className="text-white font-semibold">{item.color}</span></p>
                        <p>Size: <span className="text-white font-semibold">{item.size}</span></p>
                        <p>Price: <span className="text-cloudsfit-blue font-bold">{item.price}</span></p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 border border-neutral-700 rounded">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-neutral-800 transition"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-3 font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-neutral-800 transition"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Total & Remove */}
                      <div>
                        <p className="text-sm text-gray-400 mb-2">
                          Total: <span className="text-cloudsfit-blue font-bold">{parseFloat(item.price.replace(/[^0-9.]/g, "")) * item.quantity}</span>
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-400 transition flex items-center gap-1"
                        >
                          <Trash2 size={16} />
                          <span className="text-xs font-semibold">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/shop"
                className="text-cloudsfit-purple hover:text-cloudsfit-blue transition font-semibold uppercase text-sm"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 h-fit sticky top-24">
            <h3 className="text-xl font-bold uppercase mb-6">Order Summary</h3>

            <div className="space-y-4 mb-6 border-b border-neutral-800 pb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Subtotal ({itemCount} items)</span>
                <span className="text-white font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Shipping</span>
                <span className="text-white font-semibold">
                  {shipping === 0 ? (
                    <span className="text-green-400">FREE</span>
                  ) : (
                    `₹${shipping}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Tax (18%)</span>
                <span className="text-white font-semibold">₹{tax}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold uppercase">Total</span>
              <span className="text-2xl font-extrabold text-cloudsfit-blue">₹{total}</span>
            </div>

            {subtotal < 999 && (
              <div className="bg-cloudsfit-purple/20 border border-cloudsfit-purple rounded p-3 mb-6 text-xs text-center">
                <p className="text-cloudsfit-purple font-semibold">
                  Add ₹{(999 - subtotal).toFixed(2)} more for FREE shipping!
                </p>
              </div>
            )}

            <button className="w-full bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue py-3 font-bold uppercase rounded-lg hover:opacity-90 transition mb-3">
              Proceed to Checkout
            </button>

            <button className="w-full border border-neutral-700 py-3 font-bold uppercase rounded-lg hover:border-cloudsfit-purple transition text-gray-300">
              Continue Shopping
            </button>

            <div className="mt-6 text-xs text-gray-500 space-y-2">
              <p>✓ Free shipping on orders over ₹999</p>
              <p>✓ Easy returns within 7 days</p>
              <p>✓ 100% secure checkout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
