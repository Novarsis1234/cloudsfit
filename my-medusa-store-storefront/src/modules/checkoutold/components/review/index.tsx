"use client"

import { Heading, Text, clx } from "@medusajs/ui"

import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <div className="bg-transparent text-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white">
          Review
        </h2>
      </div>
      {isOpen && previousStepsCompleted && (
        <div className="space-y-8">
          <div className="bg-neutral-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-xl">
            <Text className="text-gray-400 text-sm leading-relaxed">
              By clicking the <span className="text-white font-bold">Place Order</span> button, you confirm that you have
              read, understand and accept our <span className="text-cloudsfit-blue hover:underline cursor-pointer">Terms of Use</span>, <span className="text-cloudsfit-blue hover:underline cursor-pointer">Terms of Sale</span> and
              <span className="text-cloudsfit-blue hover:underline cursor-pointer"> Returns Policy</span> and acknowledge that you have read CloudsFit&apos;s Privacy Policy.
            </Text>
          </div>
          <div className="pt-4">
            <PaymentButton cart={cart} data-testid="submit-order-button" />
          </div>
        </div>
      )}
    </div>
  )
}

export default Review
