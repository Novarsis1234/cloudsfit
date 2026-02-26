import { convertToLocale } from "@/lib/util/money"
import { HttpTypes } from "@medusajs/types"

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  return (
    <div className="border-t border-white/5 pt-8">
      <h2 className="text-sm font-black uppercase tracking-widest text-white/30 mb-6">Delivery info</h2>

      <div className="grid grid-cols-1 small:grid-cols-3 gap-8">
        <div
          className="flex flex-col gap-y-3"
          data-testid="shipping-address-summary"
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Shipping Address</span>
          <div className="flex flex-col text-sm text-white/60 font-bold leading-relaxed uppercase tracking-widest">
            <span className="text-white">{order.shipping_address?.first_name} {order.shipping_address?.last_name}</span>
            <span>{order.shipping_address?.address_1} {order.shipping_address?.address_2}</span>
            <span>{order.shipping_address?.postal_code}, {order.shipping_address?.city}</span>
            <span>{order.shipping_address?.country_code?.toUpperCase()}</span>
          </div>
        </div>

        <div
          className="flex flex-col gap-y-3"
          data-testid="shipping-contact-summary"
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Contact</span>
          <div className="flex flex-col text-sm text-white/60 font-bold leading-relaxed uppercase tracking-widest">
            <span className="text-white">{order.shipping_address?.phone}</span>
            <span>{order.email}</span>
          </div>
        </div>

        <div
          className="flex flex-col gap-y-3"
          data-testid="shipping-method-summary"
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Shipping Method</span>
          <div className="flex flex-col text-sm text-white/60 font-bold leading-relaxed uppercase tracking-widest">
            <span className="text-white">{(order as any).shipping_methods?.[0]?.name}</span>
            <span className="text-cloudsfit-blue">
              {convertToLocale({
                amount: order.shipping_methods?.[0]?.total ?? 0,
                currency_code: order.currency_code,
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShippingDetails
