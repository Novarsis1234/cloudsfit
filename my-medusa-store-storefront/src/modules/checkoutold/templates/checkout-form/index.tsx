import { listCartShippingMethods } from "@/lib/data/fulfillment"
import { listCartPaymentMethods } from "@/lib/data/payment"
import { setShippingMethod } from "@/lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import Addresses from "@/modules/checkoutold/components/addresses"
import Payment from "@/modules/checkoutold/components/payment"
import Review from "@/modules/checkoutold/components/review"
import Shipping from "@/modules/checkoutold/components/shipping"

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) {
    return null
  }

  console.log(`[CheckoutForm] Rendering for cart: ${cart.id}`)
  const shippingMethods = await listCartShippingMethods(cart.id)
  console.log(`[CheckoutForm] Found ${shippingMethods?.length || 0} shipping methods`)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")
  console.log(`[CheckoutForm] Found ${paymentMethods?.length || 0} payment methods:`, paymentMethods?.map(m => m.id))

  // Auto-select the shipping method if only one option exists (e.g. free shipping)
  // and the cart doesn't already have a shipping method attached.
  // This prevents the Medusa backend from returning "cart not ready" at order placement.
  const cartHasShipping = (cart.shipping_methods?.length ?? 0) > 0
  if (!cartHasShipping && shippingMethods?.length === 1) {
    try {
      console.log(`[CheckoutForm] Auto-selecting single shipping method: ${shippingMethods[0].id}`)
      await setShippingMethod({ cartId: cart.id, shippingMethodId: shippingMethods[0].id })
      console.log(`[CheckoutForm] Shipping method auto-selected successfully`)
    } catch (e) {
      console.warn(`[CheckoutForm] Failed to auto-select shipping method:`, e)
    }
  }

  if (!shippingMethods || !paymentMethods) {
    console.warn("[CheckoutForm] Missing shipping or payment methods!")
    return (
      <div className="p-8 text-white bg-red-900/20 rounded-2xl border border-red-500/50">
        <Heading level="h2" className="text-xl mb-4">Checkout Configuration Error</Heading>
        <Text>Unable to load shipping or payment methods. Please check your backend configuration.</Text>
      </div>
    )
  }

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <Addresses cart={cart} customer={customer} />

      <Shipping cart={cart} availableShippingMethods={shippingMethods} />

      <Payment cart={cart} availablePaymentMethods={paymentMethods} />

      <Review cart={cart} />
    </div>
  )
}

