import { cookies as nextCookies } from "next/headers"

import Help from "@/modules/order/components/help"
import Items from "@/modules/order/components/items"
import OnboardingCta from "@/modules/order/components/onboarding-cta"
import OrderDetails from "@/modules/order/components/order-details"
import ShippingDetails from "@/modules/order/components/shipping-details"
import PaymentDetails from "@/modules/order/components/payment-details"
import OrderSummary from "@/modules/order/components/order-summary"
import { HttpTypes } from "@medusajs/types"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  return (
    <div className="py-12 min-h-[calc(100vh-64px)]">
      <div className="content-container flex flex-col justify-center items-center gap-y-12 max-w-4xl h-full w-full">
        {isOnboarding && <OnboardingCta orderId={order.id} />}

        <div className="flex flex-col gap-y-2 text-center">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            Thank you!
          </h1>
          <p className="text-white/40 text-lg font-bold uppercase tracking-widest">
            Order confirmed
          </p>
        </div>

        <div
          className="flex flex-col gap-12 h-full bg-neutral-950/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 small:p-12 w-full"
          data-testid="order-complete-container"
        >
          <OrderDetails order={order} showStatus />

          <div className="flex flex-col gap-y-4 border-t border-white/5 pt-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-white/30">Order Summary</h2>
            <Items order={order} />
          </div>

          <OrderSummary order={order} />
          <ShippingDetails order={order} />
          <PaymentDetails order={order} />
          <Help />
        </div>
      </div>
    </div>
  )
}
