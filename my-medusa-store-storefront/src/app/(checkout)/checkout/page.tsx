import { retrieveCart } from "@/lib/data/cart"
import { retrieveCustomer } from "@/lib/data/customer"
import PaymentWrapper from "@/modules/checkoutold/components/payment-wrapper"
import CheckoutForm from "@/modules/checkoutold/templates/checkout-form"
import CheckoutSummary from "@/modules/checkoutold/templates/checkout-summary"
import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Checkout",
}

export default async function Checkout() {
  const cart = await retrieveCart()

  if (!cart) {
    return redirect("/cart")
  }

  const customer = await retrieveCustomer()

  return (
    <div className="min-h-screen bg-black">
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
    </div>
  )
}

