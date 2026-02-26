"use client"

import OrderCard from "../order-card"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  if (orders?.length) {
    return (
      <div className="flex flex-col gap-y-4 w-full" data-testid="orders-container">
        {orders.map((o) => (
          <OrderCard key={o.id} order={o} />
        ))}
      </div>
    )
  }

  return (
    <div
      className="w-full flex flex-col items-center justify-center gap-y-6 py-20 bg-neutral-950/40 backdrop-blur-xl border border-white/5 rounded-2xl"
      data-testid="no-orders-container"
    >
      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-3xl">
        📦
      </div>
      <div className="text-center">
        <h2 className="text-white font-black text-xl uppercase tracking-tighter mb-2">
          No orders yet
        </h2>
        <p className="text-white/40 text-sm max-w-xs">
          You haven&apos;t placed any orders yet. Start shopping and they&apos;ll appear here.
        </p>
      </div>
      <LocalizedClientLink
        href="/"
        className="inline-flex items-center gap-x-2 bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue text-white font-black uppercase tracking-widest text-xs px-8 py-3 rounded-xl hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.5)] transition-all"
        data-testid="continue-shopping-button"
      >
        Start Shopping →
      </LocalizedClientLink>
    </div>
  )
}

export default OrderOverview
