import { HttpTypes } from "@medusajs/types"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ")
    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  const statusLabel: Record<string, string> = {
    pending: "Processing",
    completed: "Completed",
    cancelled: "Cancelled",
    requires_action: "Action Required",
  }

  const paymentStatusColor = {
    captured: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    pending: "text-amber-400 bg-amber-400/10 border-amber-400/30",
    not_paid: "text-rose-400 bg-rose-400/10 border-rose-400/30",
  }[order.payment_status as string] ?? "text-blue-400 bg-blue-400/10 border-blue-400/30"

  const fulfillmentStatusColor = {
    fulfilled: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    not_fulfilled: "text-amber-400 bg-amber-400/10 border-amber-400/30",
    partially_fulfilled: "text-blue-400 bg-blue-400/10 border-blue-400/30",
    shipped: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  }[order.fulfillment_status as string] ?? "text-blue-400 bg-blue-400/10 border-blue-400/30"

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-2">
        <p className="text-white font-black text-xl tracking-tighter">
          Order number: <span className="text-cloudsfit-blue" data-testid="order-id">#{order.display_id}</span>
        </p>
        <p className="text-white/40 text-sm font-bold uppercase tracking-widest">
          Order date:{" "}
          <span className="text-white" data-testid="order-date">
            {new Date(order.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </p>
        <p className="text-white/40 text-sm">
          We have sent the order confirmation details to{" "}
          <span className="text-white font-bold" data-testid="order-email">
            {order.email}
          </span>
          .
        </p>
      </div>

      {showStatus && (
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Payment Status</span>
            <span className={`text-[10px] inline-flex font-bold uppercase tracking-widest px-3 py-1 rounded-full border w-fit ${paymentStatusColor}`} satatestid="order-payment-status">
              {formatStatus(order.payment_status)}
            </span>
          </div>
          <div className="flex flex-col gap-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Fulfillment Status</span>
            <span className={`text-[10px] inline-flex font-bold uppercase tracking-widest px-3 py-1 rounded-full border w-fit ${fulfillmentStatusColor}`} data-testid="order-status">
              {formatStatus(order.fulfillment_status)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderDetails
