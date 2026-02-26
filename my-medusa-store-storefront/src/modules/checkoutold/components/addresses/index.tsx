"use client"

import { setAddresses } from "@/lib/data/cart"
import compareAddresses from "@/lib/util/compare-addresses"
import { CheckCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text, useToggleState } from "@medusajs/ui"
import Divider from "@/modules/common/components/divider"
import Spinner from "@/modules/common/icons/spinner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState, useEffect } from "react"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"

const Addresses = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "address" || !searchParams.get("step")

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }

  const [message, formAction] = useActionState(setAddresses, null)

  return (
    <div className="bg-neutral-950/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 transition-all duration-500 hover:border-white/10 shadow-2xl">
      <div className="flex flex-row items-center justify-between mb-8">
        <Heading
          level="h2"
          className="flex flex-row items-center gap-x-2 text-2xl font-black uppercase tracking-tighter text-white"
        >
          <span className="w-8 h-8 rounded-full bg-cloudsfit-blue flex items-center justify-center text-black text-sm">1</span>
          Shipping Address
        </Heading>
        {isOpen && (
          <Text className="text-xs text-white/30 uppercase tracking-widest font-bold">
            Step 1 of 3
          </Text>
        )}
        {!isOpen && cart?.shipping_address && (
          <CheckCircleSolid className="text-cloudsfit-blue w-6 h-6" />
        )}
      </div>
      {isOpen ? (
        <form action={formAction}>
          <div className="pb-8">
            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
            />

            {!sameAsBilling && (
              <div className="mt-12 pt-12 border-t border-white/5">
                <Heading level="h2" className="text-xl font-black uppercase tracking-tighter text-white mb-8">
                  Billing Address
                </Heading>
                <BillingAddress cart={cart} />
              </div>
            )}

            <div className="pt-6">
              <SubmitButton className="w-full sm:w-auto bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue text-white font-black uppercase tracking-widest text-xs px-10 py-4 rounded-xl hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.5)] transition-all" data-testid="submit-address-button">
                Continue to delivery
              </SubmitButton>
            </div>
            <ErrorMessage error={message} data-testid="address-error-message" />
          </div>
        </form>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && cart.shipping_address ? (
              <div className="flex items-start justify-between">
                <div className="flex flex-col bg-neutral-900/30 p-6 rounded-2xl border border-white/5 shadow-xl max-w-sm">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Shipping Address</span>
                  <Text className="text-white font-bold text-lg">
                    {cart.shipping_address.first_name} {cart.shipping_address.last_name}
                  </Text>
                  <Text className="text-white/60">
                    {cart.shipping_address.address_1} {cart.shipping_address.address_2}
                  </Text>
                  <Text className="text-white/60">
                    {cart.shipping_address.postal_code}, {cart.shipping_address.city}
                  </Text>
                  <Text className="text-white/60">
                    {cart.shipping_address.country_code?.toUpperCase()}
                  </Text>
                </div>
                <button
                  onClick={handleEdit}
                  className="text-cloudsfit-blue hover:text-cloudsfit-blue/80 text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Edit
                </button>
              </div>
            ) : (
              <div className="flex justify-center py-4">
                <Spinner />
              </div>
            )}
          </div>
        </div>
      )}
      <Divider className="opacity-10 mt-8" />
    </div>
  )
}

export default Addresses
