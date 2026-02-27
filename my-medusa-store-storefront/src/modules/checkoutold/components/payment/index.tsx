"use client"

import { RadioGroup } from "@headlessui/react"
import { isRazorpay, isStripeLike, paymentInfoMap } from "@/lib/constants"
import { initiatePaymentSession } from "@/lib/data/cart"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { Button, Heading, Text, clx } from "@medusajs/ui"
import ErrorMessage from "@/modules/checkoutold/components/error-message"
import PaymentContainer from "@/modules/checkoutold/components/payment-container"
import PaymentButton from "@/modules/checkoutold/components/payment-button"
import Divider from "@/modules/common/components/divider"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: any
  availablePaymentMethods: any[]
}) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  console.log("[Payment] activeSession:", activeSession)
  console.log("[Payment] availablePaymentMethods:", availablePaymentMethods)
  console.log("[Payment] selectedPaymentMethod:", selectedPaymentMethod)

  useEffect(() => {
    if (!selectedPaymentMethod && availablePaymentMethods?.length) {
      const razorpayMethod = availablePaymentMethods.find(m => m && isRazorpay(m.id))
      if (razorpayMethod) {
        setPaymentMethod(razorpayMethod.id)
      } else if (availablePaymentMethods[0]) {
        setSelectedPaymentMethod(availablePaymentMethods[0].id)
      }
    }
  }, [availablePaymentMethods, selectedPaymentMethod])

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)

    const hasActiveSession = cart.payment_collection?.payment_sessions?.some(
      (s: any) => s.provider_id === method && s.status === "pending"
    )

    if (!cart?.shipping_methods?.length) {
      return
    }

    if (!hasActiveSession && (isStripeLike(method) || isRazorpay(method))) {
      try {
        await initiatePaymentSession(cart, {
          provider_id: method,
        })
      } catch (err: any) {
        setError(err.message || "Failed to initiate payment. Please try again.")
      }
    }
  }

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const shouldInputCard =
        isStripeLike(selectedPaymentMethod) && !activeSession

      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }

      if (!shouldInputCard) {
        return router.push(
          pathname + "?" + createQueryString("step", "review"),
          {
            scroll: false,
          }
        )
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
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
          <span className="w-8 h-8 rounded-full bg-cloudsfit-blue flex items-center justify-center text-black text-sm">3</span>
          Payment Method
        </Heading>
        {isOpen && (
          <Text className="text-xs text-white/30 uppercase tracking-widest font-bold">
            Final Step
          </Text>
        )}
        {!isOpen && cart?.payment_collection?.payment_sessions?.[0] && (
          <CheckCircleSolid className="text-cloudsfit-blue w-6 h-6" />
        )}
      </div>

      {isOpen ? (
        <div className="pb-8">
          <RadioGroup value={selectedPaymentMethod} onChange={setPaymentMethod}>
            <div className="grid grid-cols-1 gap-y-3">
              {availablePaymentMethods?.filter(Boolean).map((method) => {
                const isSelected = selectedPaymentMethod === method.id
                return (
                  <div key={method.id} className="flex flex-col gap-y-3">
                    <RadioGroup.Option
                      value={method.id}
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
                            {paymentInfoMap[method.id]?.title || method.id}
                          </span>
                        </div>
                      </div>
                      <div className="text-white">
                        {paymentInfoMap[method.id]?.icon || <CreditCard />}
                      </div>
                    </RadioGroup.Option>

                    {isSelected && isStripeLike(method.id) && (
                      <div className="px-8 pb-4">
                        <PaymentContainer
                          paymentInfoMap={paymentInfoMap}
                          paymentProviderId={method.id}
                          selectedPaymentOptionId={selectedPaymentMethod}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </RadioGroup>


          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          <div className="pt-6">
            {isRazorpay(selectedPaymentMethod) ? (
              <PaymentButton cart={cart} data-testid="submit-payment-button" selectedPaymentMethod={selectedPaymentMethod} />
            ) : (
              <Button
                size="large"
                className="w-full sm:w-auto bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue text-white font-black uppercase tracking-widest text-xs px-10 py-4 rounded-xl hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.5)] transition-all disabled:opacity-50"
                onClick={handleSubmit}
                isLoading={isLoading}
                disabled={
                  (isStripeLike(selectedPaymentMethod) && !cardComplete) ||
                  (!selectedPaymentMethod && !paidByGiftcard)
                }
                data-testid="submit-payment-button"
              >
                {!activeSession && isStripeLike(selectedPaymentMethod)
                  ? "Enter card details"
                  : "Continue to review"}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="pb-8">
          {cart && paymentReady && activeSession ? (
            <div className="flex items-start justify-between">
              <div className="flex flex-col bg-neutral-900/30 p-6 rounded-2xl border border-white/5 shadow-xl max-w-sm">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Payment method</span>
                <div className="flex items-center gap-x-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-neutral-800 border border-white/5 shadow-lg overflow-hidden p-2 text-white">
                    {paymentInfoMap[activeSession.provider_id]?.icon || <CreditCard />}
                  </div>
                  <Text className="text-white font-bold text-lg">
                    {paymentInfoMap[activeSession.provider_id]?.title || activeSession.provider_id}
                  </Text>
                </div>
              </div>
              <button
                onClick={handleEdit}
                className="text-cloudsfit-blue hover:text-cloudsfit-blue/80 text-xs font-bold uppercase tracking-widest transition-colors"
              >
                Edit
              </button>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col bg-neutral-900/30 p-6 rounded-2xl border border-white/5 shadow-xl max-w-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Payment method</span>
              <Text className="text-white font-bold">Gift card</Text>
            </div>
          ) : null}
        </div>
      )}
      <Divider className="opacity-10 mt-8" />
    </div>
  )
}

export default Payment
