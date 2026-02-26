import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"
import ShippingAutoSelect from "@modules/checkout/components/shipping-auto-select"
import { PaymentErrorBoundary } from "@modules/checkout/components/payment-error-boundary"

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

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(
    cart.region?.id ?? cart.region_id ?? ""
  )

  if (!shippingMethods || !paymentMethods) {
    return null
  }

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <Addresses cart={cart} customer={customer} />

      <Shipping cart={cart} availableShippingMethods={shippingMethods} />

      <ShippingAutoSelect cart={cart} availableShippingMethods={shippingMethods} />

      <PaymentErrorBoundary>
        <Payment cart={cart} availablePaymentMethods={paymentMethods} />
      </PaymentErrorBoundary>
    </div>
  )
}
