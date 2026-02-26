"use client"

import { XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import Help from "@/modules/order/components/help"
import Items from "@/modules/order/components/items"
import OrderDetails from "@/modules/order/components/order-details"
import OrderSummary from "@/modules/order/components/order-summary"
import ShippingDetails from "@/modules/order/components/shipping-details"
import React from "react"

type OrderDetailsTemplateProps = {
  order: HttpTypes.StoreOrder
}

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
}) => {
  return (
    <div className="flex flex-col justify-center gap-y-6">
      <div className="flex gap-2 justify-between items-end border-b border-white/5 pb-6">
        <div className="flex flex-col gap-y-1">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Order Details</h1>
          <p className="text-white/40 text-sm">
            View everything about your order.
          </p>
        </div>
        <LocalizedClientLink
          href="/account/orders"
          className="flex gap-2 items-center text-xs font-bold uppercase tracking-widest text-cloudsfit-blue hover:text-cloudsfit-blue/70 transition-colors"
          data-testid="back-to-overview-button"
        >
          <XMark /> Back to overview
        </LocalizedClientLink>
      </div>
      <div
        className="flex flex-col gap-8 h-full bg-neutral-950/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8"
        data-testid="order-details-container"
      >
        <OrderDetails order={order} showStatus />
        <Items order={order} />
        <ShippingDetails order={order} />
        <OrderSummary order={order} />
        <Help />
      </div>
    </div>
  )
}

export default OrderDetailsTemplate

