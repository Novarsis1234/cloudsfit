"use client"

import { convertToLocale } from "@/lib/util/money"
import React from "react"

type CartTotalsProps = {
  totals: {
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    currency_code: string
    item_subtotal?: number | null
    shipping_subtotal?: number | null
    discount_subtotal?: number | null
    items?: any[]
  }
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const {
    currency_code,
    total,
    item_subtotal,
    shipping_subtotal,
    discount_subtotal,
    items = []
  } = totals

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-y-4 text-sm font-bold tracking-tight text-white/40">
        <div className="flex items-center justify-between">
          <span className="uppercase tracking-widest text-[10px]">Subtotal ({items.reduce((acc: number, item: any) => acc + item.quantity, 0)} items)</span>
          <span className="text-white font-black tracking-tighter" data-testid="cart-subtotal" data-value={item_subtotal || 0}>
            {convertToLocale({ amount: item_subtotal ?? 0, currency_code })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="uppercase tracking-widest text-[10px]">Shipping</span>
          <span className="text-cloudsfit-blue font-black tracking-tighter uppercase" data-testid="cart-shipping" data-value={shipping_subtotal || 0}>
            {shipping_subtotal === 0 ? 'FREE' : convertToLocale({ amount: shipping_subtotal ?? 0, currency_code })}
          </span>
        </div>
        {!!discount_subtotal && (
          <div className="flex items-center justify-between text-cloudsfit-purple">
            <span className="uppercase tracking-widest text-[10px]">Discount Applied</span>
            <span
              data-testid="cart-discount"
              data-value={discount_subtotal || 0}
              className="font-black tracking-tighter"
            >
              -{" "}
              {convertToLocale({
                amount: discount_subtotal ?? 0,
                currency_code,
              })}
            </span>
          </div>
        )}
      </div>

      <div className="h-px w-full bg-white/5" />

      <div className="flex items-center justify-between text-white py-2">
        <span className="text-2xl font-black uppercase tracking-tighter ring-offset-4">Order Total</span>
        <span
          className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]"
          data-testid="cart-total"
          data-value={total || 0}
        >
          {convertToLocale({ amount: total ?? 0, currency_code })}
        </span>
      </div>
    </div>
  )
}

export default CartTotals
