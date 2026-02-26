import { Heading } from "@medusajs/ui"

import ItemsPreviewTemplate from "@/modules/cart/templates/preview"
import DiscountCode from "@/modules/checkoutold/components/discount-code"
import CartTotals from "@/modules/common/components/cart-totals"
import Divider from "@/modules/common/components/divider"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="flex flex-col gap-y-8">
      <div className="w-full flex flex-col">
        <Heading
          level="h2"
          className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white mb-6"
        >
          Order Summary
        </Heading>
        <CartTotals totals={cart} />
        <Divider className="my-6 opacity-10" />
        <ItemsPreviewTemplate cart={cart} />
        <div className="mt-8">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary

