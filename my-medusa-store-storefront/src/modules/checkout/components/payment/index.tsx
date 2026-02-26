"use client"

import { RadioGroup } from "@headlessui/react"
import { isStripeLike, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { Button, Container, Heading, Text, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer, {
  StripeCardContainer,
} from "@modules/checkout/components/payment-container"
import Divider from "@modules/common/components/divider"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import PaymentButton from "../payment-button"

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

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    // Initialize payment session for Stripe-like or Razorpay methods
    if (isStripeLike(method)) {
      await initiatePaymentSession(cart, {
        provider_id: method,
      })
    }
  }

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  // Payment is ready if there is an active session or paid by giftcard
  // Shipping methods are intentionally NOT required in this flow.
  const paymentReady = !!activeSession || paidByGiftcard

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
    setError(null)
    
    // Ensure scroll is enabled
    document.body.style.overflow = "auto"
    document.documentElement.style.overflow = "auto"
    
    try {
      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession) {
        console.log(`[Payment] Initiating payment session for: ${selectedPaymentMethod}`)
        console.log(`[Payment] Cart ID: ${cart.id}`)
        console.log(`[Payment] Cart total: ${cart.total}`)
        
        if (!cart?.id) {
          setError("Invalid cart. Please refresh the page and try again.")
          setIsLoading(false)
          return
        }

        const result = await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
        
        // Check if result contains an error (structured error object returned from server)
        if (result?.error) {
          console.error("[Payment] Payment session initialization failed:", result)
          
          let errorMsg = result.message || "Failed to initialize payment. Please try again."
          
          // Check for specific error cases
          if (errorMsg.includes("RAZORPAY_KEY") || errorMsg.includes("credentials")) {
            errorMsg = "Payment system is not configured. Please contact support."
          } else if (errorMsg.includes("Network") || errorMsg.includes("network")) {
            errorMsg = "Network error. Please check your connection and try again."
          }
          
          setError(errorMsg)
          setIsLoading(false)
          return // Don't proceed if initialization failed
        }
        
        console.log(`[Payment] Payment session initiated successfully`)
        
        // Small delay to ensure backend has processed
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Refresh the page to get the updated cart with payment session
        router.refresh()
      }
    } catch (err: any) {
      console.error("[Payment] Unexpected error:", err)
      setError("An unexpected error occurred. Please refresh and try again.")
      setIsLoading(false)
    } finally {
      // Always ensure scroll is restored
      document.body.style.overflow = "auto"
      document.documentElement.style.overflow = "auto"
    }
  }

  useEffect(() => {
    setError(null)
    // Ensure scroll is always restored
    document.body.style.overflow = "auto"
    document.documentElement.style.overflow = "auto"
  }, [isOpen])


  // Auto-select first available payment method if none selected
  useEffect(() => {
    if (isOpen && !selectedPaymentMethod && availablePaymentMethods?.length > 0) {
      const filteredMethods = availablePaymentMethods.filter((m) => {
        if (m.id === "pp_system_default") {
          return false
        }
        if (m.id === "manual") {
          return cart?.shipping_address?.country_code === "in"
        }
        return true
      })
      
      if (filteredMethods.length > 0 && !activeSession) {
        const firstMethod = filteredMethods[0].id
        setSelectedPaymentMethod(firstMethod)
        // Don't auto-initiate for Razorpay, let user click the button
      }
    }
  }, [isOpen, selectedPaymentMethod, availablePaymentMethods, cart?.shipping_address?.country_code, activeSession])

  // Auto-navigate to payment when ready
  useEffect(() => {
    if (!isOpen && paymentReady) {
      console.log("[Payment] Auto-navigating to payment.")
      router.push(pathname + "?step=payment", { scroll: false })
    }
  }, [isOpen, paymentReady, pathname, router, cart?.id])

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && !paymentReady,
            }
          )}
        >
          Payment
          {!isOpen && paymentReady && <CheckCircleSolid />}
        </Heading>
        {!isOpen && paymentReady && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-payment-button"
            >
              Edit
            </button>
          </Text>
        )}
      </div>
      <div>
        <div className={isOpen ? "block" : "hidden"}>
          {!paidByGiftcard && availablePaymentMethods?.length && (
            <>
              <RadioGroup
                value={selectedPaymentMethod}
                onChange={(value: string) => setPaymentMethod(value)}
              >
                {availablePaymentMethods
                  .filter((m) => {
                    // Filter out pp_system_default (COD) completely
                    if (m.id === "pp_system_default") {
                      return false
                    }
                    // Keep manual payment for India only
                    if (m.id === "manual") {
                      return cart?.shipping_address?.country_code === "in"
                    }
                    return true
                  })
                  .map((paymentMethod) => (
                  <div key={paymentMethod.id}>
                    {isStripeLike(paymentMethod.id) ? (
                      <StripeCardContainer
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                        paymentInfoMap={paymentInfoMap}
                        setCardBrand={setCardBrand}
                        setError={setError}
                        setCardComplete={setCardComplete}
                      />
                    ) : (
                      <PaymentContainer
                        paymentInfoMap={paymentInfoMap}
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                      />
                    )}
                  </div>
                ))}
              </RadioGroup>
            </>
          )}

          {paidByGiftcard && (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Payment method
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Gift card
              </Text>
            </div>
          )}

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          <div className="mt-6">
            {activeSession ? (
              <PaymentButton cart={cart} data-testid="submit-order-button" />
            ) : (
              <Button
                size="large"
                onClick={handleSubmit}
                isLoading={isLoading}
                disabled={
                  (isStripeLike(selectedPaymentMethod) && !cardComplete) ||
                  (!selectedPaymentMethod && !paidByGiftcard)
                }
                data-testid="submit-payment-button"
              >
                {isStripeLike(selectedPaymentMethod)
                  ? "Enter card details"
                  : "Place Order"}
              </Button>
            )}
          </div>
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && activeSession ? (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment method
                </Text>
                <Text
                  className="txt-medium text-ui-fg-subtle"
                  data-testid="payment-method-summary"
                >
                  {paymentInfoMap[activeSession?.provider_id]?.title ||
                    activeSession?.provider_id}
                </Text>
              </div>
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment details
                </Text>
                <div
                  className="flex gap-2 txt-medium text-ui-fg-subtle items-center"
                  data-testid="payment-details-summary"
                >
                  <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                    {paymentInfoMap[selectedPaymentMethod]?.icon || (
                      <CreditCard />
                    )}
                  </Container>
                  <Text>
                    {isStripeLike(selectedPaymentMethod) && cardBrand
                      ? cardBrand
                      : "Another step will appear"}
                  </Text>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Payment method
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Gift card
              </Text>
            </div>
          ) : null}
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default Payment
