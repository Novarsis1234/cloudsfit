"use client"

import { Button, Heading } from "@medusajs/ui"

import CartTotals from "@/modules/common/components/cart-totals"
import Divider from "@/modules/common/components/divider"
import DiscountCode from "@/modules/checkoutold/components/discount-code"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <div className="flex flex-col gap-y-10">
      <div>
        <h2 className="text-xl font-black uppercase tracking-widest text-white">
          Order Summary
        </h2>
      </div>

      <div className="space-y-6">
        <DiscountCode cart={cart} />
        <div className="bg-neutral-900/50 p-6 rounded-3xl border border-white/5">
          <CartTotals totals={cart} />
        </div>
      </div>

      <div className="space-y-4">
        <LocalizedClientLink
          href={"/checkout?step=" + step}
          data-testid="checkout-button"
          className="block"
        >
          <Button className="w-full h-14 bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-[0_0_40px_-10px_rgba(37,99,235,0.4)] hover:shadow-[0_0_50px_-10px_rgba(37,99,235,0.6)] active:scale-[0.98] transition-all border-none">
            Proceed to Checkout
          </Button>
        </LocalizedClientLink>

        <LocalizedClientLink
          href="/store"
          className="block text-center text-xs font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors"
        >
          Continue Shopping
        </LocalizedClientLink>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-10 border-t border-white/5">
        <div className="flex flex-col items-center gap-y-2 opacity-60 hover:opacity-100 transition-opacity">
          <svg className="w-6 h-6 text-cloudsfit-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 18h14M5 8h14M5 13h14M2 4h20v16H2z" />
          </svg>
          <span className="text-[9px] font-bold uppercase text-white">Free Ship</span>
        </div>
        <div className="flex flex-col items-center gap-y-2 opacity-60 hover:opacity-100 transition-opacity">
          <svg className="w-6 h-6 text-cloudsfit-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path d="M12 7v5l3 3" />
          </svg>
          <span className="text-[9px] font-bold uppercase text-white underline underline-offset-4 decoration-cloudsfit-blue/30">7 Day Return</span>
        </div>
        <div className="flex flex-col items-center gap-y-2 opacity-60 hover:opacity-100 transition-opacity">
          <svg className="w-6 h-6 text-cloudsfit-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span className="text-[9px] font-bold uppercase text-white">Secure Pay</span>
        </div>
      </div>
    </div>
  )
}

export default Summary

