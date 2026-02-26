import { Container } from "@medusajs/ui"
import { paymentInfoMap } from "@/lib/constants"
import { convertToLocale } from "@/lib/util/money"
import { HttpTypes } from "@medusajs/types"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const payment = order.payment_collections?.[0].payments?.[0]

  return (
    <div className="border-t border-white/5 pt-8">
      <h2 className="text-sm font-black uppercase tracking-widest text-white/30 mb-6">Payment</h2>
      <div>
        {payment && (
          <div className="grid grid-cols-1 small:grid-cols-3 gap-8 w-full">
            <div className="flex flex-col gap-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Method</span>
              <span
                className="text-sm text-white font-bold leading-relaxed uppercase tracking-widest"
                data-testid="payment-method"
              >
                {paymentInfoMap[payment.provider_id].title}
              </span>
            </div>
            <div className="flex flex-col gap-y-3 col-span-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Details</span>
              <div className="flex gap-4 items-center">
                <div className="flex items-center justify-center h-10 w-14 rounded-xl bg-neutral-900 border border-white/5 shadow-lg">
                  {paymentInfoMap[payment.provider_id].icon}
                </div>
                <div className="flex flex-col text-sm text-white/60 font-bold leading-relaxed uppercase tracking-widest">
                  <span data-testid="payment-amount">
                    {payment.data?.card_last4
                      ? `**** **** **** ${payment.data.card_last4}`
                      : `${convertToLocale({
                        amount: payment.amount,
                        currency_code: order.currency_code,
                      })} paid`}
                  </span>
                  <span className="text-[10px] text-white/30">
                    {new Date(payment.created_at ?? "").toLocaleString("en-IN", {
                      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentDetails
