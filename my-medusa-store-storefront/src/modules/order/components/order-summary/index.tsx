import { convertToLocale } from "@/lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OrderSummaryProps = {
  order: HttpTypes.StoreOrder
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const getAmount = (amount?: number | null) => {
    if (amount === undefined || amount === null) {
      return
    }

    return convertToLocale({
      amount,
      currency_code: order.currency_code,
    })
  }

  return (
    <div className="border-t border-white/5 pt-8">
      <h2 className="text-sm font-black uppercase tracking-widest text-white/30 mb-6">Payment Summary</h2>
      <div className="flex flex-col gap-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-white/40">
          <span>Subtotal</span>
          <span className="text-white">{getAmount(order.subtotal)}</span>
        </div>

        {order.discount_total > 0 && (
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-rose-400">
            <span>Discount</span>
            <span>- {getAmount(order.discount_total)}</span>
          </div>
        )}

        {order.gift_card_total > 0 && (
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-white/40">
            <span>Gift card</span>
            <span className="text-white">- {getAmount(order.gift_card_total)}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-white/40">
          <span>Shipping</span>
          <span className="text-white">{getAmount(order.shipping_total)}</span>
        </div>

        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-white/40">
          <span>Taxes</span>
          <span className="text-white">{getAmount(order.tax_total)}</span>
        </div>

        <div className="h-px w-full border-b border-white/5 border-dashed my-2" />

        <div className="flex items-center justify-between text-xl font-black uppercase tracking-tighter text-white">
          <span>Total</span>
          <span className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue">
            {getAmount(order.total)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
