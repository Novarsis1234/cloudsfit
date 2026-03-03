import { retrieveCart, ensureShippingMethod } from "@/lib/data/cart"
import { retrieveCustomer } from "@/lib/data/customer"
import { listCartShippingMethods } from "@/lib/data/fulfillment"
import PaymentWrapper from "@/modules/checkoutold/components/payment-wrapper"
import CheckoutForm from "@/modules/checkoutold/templates/checkout-form"
import CheckoutSummary from "@/modules/checkoutold/templates/checkout-summary"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Checkout",
}

export default async function Checkout() {
  const cart = await retrieveCart()

  if (!cart) {
    return redirect("/cart")
  }

  // Auto-attach shipping method when cart has none (e.g. free shipping).
  // Must be done here in page.tsx — NOT inside a component render — because
  // Next.js forbids revalidateTag during render. ensureShippingMethod skips revalidateTag.
  const cartHasShipping = (cart.shipping_methods?.length ?? 0) > 0
  if (!cartHasShipping) {
    const shippingOptions = await listCartShippingMethods(cart.id)
    if (shippingOptions && shippingOptions.length > 0) {
      console.log(`[Checkout page] Auto-selecting shipping method: ${shippingOptions[0].id}`)
      await ensureShippingMethod({ cartId: cart.id, shippingMethodId: shippingOptions[0].id })
    }
  }

  const customer = await retrieveCustomer()

  return (
    <div className="min-h-screen bg-black">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-white">Loading Checkout...</div>}>
        <div className="content-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
            <div className="flex flex-col bg-neutral-950/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 sm:p-10 gap-y-10 shadow-2xl">
              <PaymentWrapper cart={cart}>
                <CheckoutForm cart={cart} customer={customer} />
              </PaymentWrapper>
            </div>
            <div className="lg:sticky lg:top-28">
              <div className="bg-neutral-950/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 sm:p-10 shadow-2xl">
                <CheckoutSummary cart={cart} />
              </div>
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  )
}
