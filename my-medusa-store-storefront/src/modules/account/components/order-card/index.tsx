import { useMemo } from "react"
import Thumbnail from "@/modules/products/components/thumbnail"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { convertToLocale } from "@/lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const OrderCard = ({ order }: OrderCardProps) => {
  const numberOfLines = useMemo(() => {
    return order.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0
  }, [order])

  const numberOfProducts = useMemo(() => {
    return order.items?.length ?? 0
  }, [order])

  const statusLabel: Record<string, string> = {
    pending: "Processing",
    completed: "Completed",
    cancelled: "Cancelled",
    requires_action: "Action Required",
  }

  const statusColor = {
    pending: "text-blue-400 bg-blue-400/10 border-blue-400/30",
    completed: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    cancelled: "text-rose-400 bg-rose-400/10 border-rose-400/30",
    requires_action: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  }[order.status as string] ?? "text-blue-400 bg-blue-400/10 border-blue-400/30"

  return (
    <div
      className="bg-neutral-950/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-white/10 hover:shadow-2xl hover:shadow-black/50"
      data-testid="order-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-x-3">
          <span className="text-xs font-bold uppercase tracking-widest text-white/30">Order</span>
          <span className="text-white font-black text-xl tracking-tighter" data-testid="order-display-id">
            #{order.display_id}
          </span>
          <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${statusColor}`}>
            {statusLabel[order.status as string] ?? order.status}
          </span>
        </div>
        <LocalizedClientLink
          href={`/account/orders/details/${order.id}`}
          className="text-xs font-bold uppercase tracking-widest text-cloudsfit-blue hover:text-cloudsfit-blue/70 transition-colors"
          data-testid="order-details-link"
        >
          See details →
        </LocalizedClientLink>
      </div>

      {/* Meta info */}
      <div className="flex items-center gap-x-4 mb-5 text-xs text-white/40 font-bold uppercase tracking-widest">
        <span data-testid="order-created-at">
          {new Date(order.created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
        <span className="w-1 h-1 rounded-full bg-white/20" />
        <span data-testid="order-amount" className="text-white/60">
          {convertToLocale({
            amount: order.total,
            currency_code: order.currency_code,
          })}
        </span>
        <span className="w-1 h-1 rounded-full bg-white/20" />
        <span>
          {numberOfLines} {numberOfLines === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Product thumbnails */}
      <div className="flex items-center gap-x-3">
        {order.items?.slice(0, 4).map((item, idx) => (
          <div
            key={item.id}
            className="relative flex flex-col gap-y-1"
            data-testid="order-item"
          >
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-900 border border-white/5 shadow-lg">
              <Thumbnail thumbnail={item.thumbnail} images={[]} size="full" />
            </div>
            <div className="flex items-center gap-x-1">
              <span className="text-white/50 text-[10px] font-bold uppercase tracking-wider truncate max-w-[60px]" data-testid="item-title">
                {item.title}
              </span>
              <span className="text-white/30 text-[10px]">×{item.quantity}</span>
            </div>
          </div>
        ))}
        {numberOfProducts > 4 && (
          <div className="w-16 h-16 rounded-xl bg-neutral-900/50 border border-white/5 flex flex-col items-center justify-center">
            <span className="text-white font-black text-sm">+{numberOfProducts - 4}</span>
            <span className="text-white/40 text-[10px] uppercase tracking-wider">more</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderCard
