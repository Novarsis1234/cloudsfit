"use client"

import { RadioGroup } from "@headlessui/react"
import { setShippingMethod } from "@/lib/data/cart"
import { calculatePriceForShippingOption } from "@/lib/data/fulfillment"
import { convertToLocale } from "@/lib/util/money"
import { CheckCircleSolid, Loader } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Button, clx, Heading, Text } from "@medusajs/ui"
import ErrorMessage from "@/modules/checkoutold/components/error-message"
import Divider from "@/modules/common/components/divider"
import MedusaRadio from "@/modules/common/components/radio"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

type ShippingProps = {
  cart: HttpTypes.StoreCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
}

const Shipping: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    cart.shipping_methods?.at(-1)?.shipping_option_id || null
  )
  const [isMethodSaved, setIsMethodSaved] = useState(
    (cart.shipping_methods?.length ?? 0) > 0
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "delivery"

  const handleEdit = () => {
    router.push(pathname + "?step=delivery", { scroll: false })
  }

  const handleSubmit = () => {
    router.push(pathname + "?step=payment", { scroll: false })
  }

  const handleSetShippingMethod = async (id: string) => {
    setError(null)
    setIsLoading(true)
    setShippingMethodId(id)

    await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
      .then(() => {
        setIsMethodSaved(true)
      })
      .catch((err) => {
        setError(err.message)
        setIsMethodSaved(false)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <div className="bg-neutral-950/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 transition-all duration-500 hover:border-white/10 shadow-2xl">
      <div className="flex flex-row items-center justify-between mb-8">
        <Heading
          level="h2"
          className="flex flex-row items-center gap-x-2 text-2xl font-black uppercase tracking-tighter text-white"
        >
          <span className="w-8 h-8 rounded-full bg-cloudsfit-blue flex items-center justify-center text-black text-sm">2</span>
          Delivery Method
        </Heading>
        {isOpen && (
          <Text className="text-xs text-white/30 uppercase tracking-widest font-bold">
            Step 2 of 3
          </Text>
        )}
        {!isOpen && (cart.shipping_methods?.length ?? 0) > 0 && (
          <CheckCircleSolid className="text-cloudsfit-blue w-6 h-6" />
        )}
      </div>

      {isOpen ? (
        <div className="pb-8">
          {availableShippingMethods && availableShippingMethods.length > 0 ? (
            <RadioGroup value={shippingMethodId} onChange={handleSetShippingMethod}>
              <div className="grid grid-cols-1 gap-y-3">
                {availableShippingMethods.map((option) => {
                  const isSelected = shippingMethodId === option.id
                  return (
                    <RadioGroup.Option
                      key={option.id}
                      value={option.id}
                      className={clx(
                        "flex items-center justify-between px-8 py-6 cursor-pointer rounded-2xl border transition-all duration-300",
                        isSelected
                          ? "bg-cloudsfit-blue/10 border-cloudsfit-blue shadow-[0_0_20px_rgba(42,168,223,0.1)]"
                          : "bg-black/40 border-white/5 hover:border-white/20"
                      )}
                    >
                      <div className="flex items-center gap-x-6">
                        <div className={clx(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                          isSelected ? "border-cloudsfit-blue" : "border-white/20"
                        )}>
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-cloudsfit-blue" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-black uppercase tracking-tighter text-lg leading-tight">
                            {option.name}
                          </span>
                        </div>
                      </div>
                      <span className="text-white font-black text-xl tracking-tighter">
                        {convertToLocale({
                          amount: option.amount || 0,
                          currency_code: cart?.currency_code || "inr",
                        })}
                      </span>
                    </RadioGroup.Option>
                  )
                })}
              </div>
            </RadioGroup>
          ) : (
            <div className="bg-amber-900/20 border border-amber-900/50 p-6 rounded-2xl mb-8">
              <Text className="text-amber-200 text-sm">
                <strong className="block text-amber-500 mb-1">Shipping Methods Unavailable</strong>
                No shipping options are available for your region yet. Please verify your address or contact support.
              </Text>
            </div>
          )}

          <ErrorMessage
            error={error}
            data-testid="delivery-option-error-message"
          />

          <div className="pt-6">
            <Button
              size="large"
              className="w-full sm:w-auto bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue text-white font-black uppercase tracking-widest text-xs px-10 py-4 rounded-xl hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.5)] transition-all disabled:opacity-50"
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={isLoading || !shippingMethodId || !isMethodSaved}
              data-testid="submit-delivery-option-button"
            >
              Continue to payment
            </Button>
          </div>
        </div>
      ) : (
        <div className="pb-8">
          {cart && (cart.shipping_methods?.length ?? 0) > 0 ? (
            <div className="flex items-start justify-between">
              <div className="flex flex-col bg-neutral-900/30 p-6 rounded-2xl border border-white/5 shadow-xl max-w-sm">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Delivery Method</span>
                <Text className="text-white font-bold text-lg">
                  {cart.shipping_methods!.at(-1)!.name}
                </Text>
                <Text className="text-cloudsfit-blue font-black mt-1">
                  {convertToLocale({
                    amount: cart.shipping_methods!.at(-1)!.amount!,
                    currency_code: cart?.currency_code,
                  })}
                </Text>
              </div>
              <button
                onClick={handleEdit}
                className="text-cloudsfit-blue hover:text-cloudsfit-blue/80 text-xs font-bold uppercase tracking-widest transition-colors"
                data-testid="edit-delivery-button"
              >
                Edit
              </button>
            </div>
          ) : null}
        </div>
      )}
      <Divider className="opacity-10 mt-8" />
    </div>
  )
}

export default Shipping
