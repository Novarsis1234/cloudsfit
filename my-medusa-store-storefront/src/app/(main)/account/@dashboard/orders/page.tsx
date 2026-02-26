import { Metadata } from "next"

import OrderOverview from "@/modules/account/components/order-overview"
import { notFound } from "next/navigation"
import { listOrders } from "@/lib/data/orders"

export const metadata: Metadata = {
  title: "Orders",
  description: "Overview of your previous orders.",
}

export default async function Orders() {
  const orders = await listOrders()

  if (!orders) {
    notFound()
  }

  return (
    <div className="w-full flex flex-col gap-y-8" data-testid="orders-page-wrapper">
      {/* Header */}
      <div className="flex flex-col gap-y-1">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Orders</h1>
        <p className="text-white/40 text-sm">
          Your full order history. View details, track shipments, or request returns.
        </p>
      </div>

      {/* Orders List */}
      <OrderOverview orders={orders} />
    </div>
  )
}
