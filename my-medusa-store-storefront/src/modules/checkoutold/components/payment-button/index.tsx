"use client"

import { isManual, isRazorpay, isStripeLike } from "@/lib/constants"
import { initiatePaymentSession, placeOrder } from "@/lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useState, useEffect, useRef } from "react"
import ErrorMessage from "../error-message"
import Script from "next/script"
import { useSearchParams } from "next/navigation"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
  selectedPaymentMethod?: string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
  selectedPaymentMethod,
}) => {
  const searchParams = useSearchParams()
  const autoOpenRazorpay = searchParams.get("buy_now") === "1"

  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]

  // Check both the active session AND the selected method (session may not exist yet)
  const activeProviderId = paymentSession?.provider_id || selectedPaymentMethod

  switch (true) {
    case isStripeLike(activeProviderId):
      return (
        <StripePaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isRazorpay(activeProviderId):
      return (
        <RazorpayPaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
          autoOpen={autoOpenRazorpay}
        />
      )
    case isManual(activeProviderId):
      return (
        <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
      )
    default:
      return (
        <Button
          disabled
          className="w-full bg-neutral-800 text-gray-500 font-black uppercase tracking-widest text-xs px-10 py-4 rounded-xl border border-white/5 opacity-50"
        >
          Select a payment method
        </Button>
      )
  }
}

const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const disabled = !stripe || !elements ? true : false

  const handlePayment = async () => {
    setSubmitting(true)

    if (!stripe || !elements || !card || !cart) {
      setSubmitting(false)
      return
    }

    await stripe
      .confirmCardPayment(session?.data.client_secret as string, {
        payment_method: {
          card: card,
          billing_details: {
            name:
              cart.billing_address?.first_name +
              " " +
              cart.billing_address?.last_name,
            address: {
              city: cart.billing_address?.city ?? undefined,
              country: cart.billing_address?.country_code ?? undefined,
              line1: cart.billing_address?.address_1 ?? undefined,
              line2: cart.billing_address?.address_2 ?? undefined,
              postal_code: cart.billing_address?.postal_code ?? undefined,
              state: cart.billing_address?.province ?? undefined,
            },
            email: cart.email,
            phone: cart.billing_address?.phone ?? undefined,
          },
        },
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent

          if (
            (pi && pi.status === "requires_capture") ||
            (pi && pi.status === "succeeded")
          ) {
            onPaymentCompleted()
          }

          setErrorMessage(error.message || null)
          return
        }

        if (
          (paymentIntent && paymentIntent.status === "requires_capture") ||
          paymentIntent.status === "succeeded"
        ) {
          return onPaymentCompleted()
        }

        return
      })
  }

  return (
    <>
      <Button
        type="button"
        disabled={disabled || notReady || submitting}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        className="w-full bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue text-white font-black uppercase tracking-widest text-xs px-10 py-4 rounded-xl hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.5)] transition-all disabled:opacity-50"
        data-testid={dataTestId}
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="stripe-payment-error-message"
      />
    </>
  )
}

const RazorpayPaymentButton = ({
  cart,
  notReady,
  autoOpen,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  autoOpen?: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const hasAutoStartedRef = useRef(false)

  const onPaymentCompleted = async () => {
    try {
      await placeOrder()
      // placeOrder does a server redirect; if we get here something went wrong
      setErrorMessage("Order placement failed. Please contact support.")
      setSubmitting(false)
    } catch (err: any) {
      // Next.js redirect() throws a special error — it's intentional, not a failure
      // If the message contains NEXT_REDIRECT it means the redirect is happening
      if (err?.message?.includes("NEXT_REDIRECT") || err?.digest?.includes("NEXT_REDIRECT")) {
        // Let the redirect happen — do nothing
        return
      }
      // For real errors, show the message and navigate to account/orders as fallback
      console.error("[Razorpay] placeOrder error:", err)
      setErrorMessage(err.message || "Order placement failed")
      setSubmitting(false)
    }
  }

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending" && isRazorpay(s.provider_id)
  )


  const waitForRazorpay = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if ((window as any).Razorpay) {
        resolve((window as any).Razorpay)
        return
      }
      let attempts = 0
      const interval = setInterval(() => {
        attempts++
        if ((window as any).Razorpay) {
          clearInterval(interval)
          resolve((window as any).Razorpay)
        } else if (attempts > 50) { // 5 seconds
          clearInterval(interval)
          reject(new Error("Razorpay SDK failed to load. Please refresh and try again."))
        }
      }, 100)
    })
  }

  const handlePayment = async () => {
    setSubmitting(true)
    setErrorMessage(null)

    // If no session yet, create one first
    let activeSession = session
    if (!activeSession) {
      try {
        await initiatePaymentSession(cart, { provider_id: "pp_razorpay_razorpay" })
        window.location.reload()
        return
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to initiate payment session")
        setSubmitting(false)
        return
      }
    }

    if (!cart) {
      setSubmitting(false)
      return
    }

    console.log("[Razorpay] Session data:", activeSession.data)
    console.log("[Razorpay] Cart total:", cart.total, "Currency:", cart.currency_code)

    const orderId = activeSession.data?.id || activeSession.data?.razorpay_order_id
    if (!orderId) {
      console.error("[Razorpay] No order_id in session data:", activeSession.data)
      setErrorMessage("Payment session is not ready. Please go back and re-select your payment method.")
      setSubmitting(false)
      return
    }

    try {
      const RazorpaySDK = await waitForRazorpay()

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: cart.total,
        currency: cart.currency_code?.toUpperCase() || "INR",
        name: "CloudsFit",
        description: "Order Checkout",
        order_id: orderId,
        modal: {
          ondismiss: () => {
            console.log("[Razorpay] Modal dismissed")
            setSubmitting(false)
          },
        },
        handler: async function (response: any) {
          console.log("[Razorpay] Payment success:", response)
          if (response.razorpay_payment_id) {
            onPaymentCompleted()
          }
        },
        prefill: {
          name:
            (cart.billing_address?.first_name || "") +
            " " +
            (cart.billing_address?.last_name || ""),
          email: cart.email,
          contact: cart.billing_address?.phone,
        },
        theme: {
          color: "#2AA8DF",
        },
      }

      console.log("[Razorpay] Opening modal with order_id:", orderId)
      const rzp = new RazorpaySDK(options)
      rzp.on("payment.failed", function (response: any) {
        console.error("[Razorpay] Payment failed:", response.error)
        setErrorMessage(response.error.description)
        setSubmitting(false)
      })
      rzp.open()
    } catch (err: any) {
      console.error("[Razorpay] Error:", err)
      setErrorMessage(err.message || "Failed to open payment window")
      setSubmitting(false)
    }
  }

  useEffect(() => {
    if (!autoOpen || notReady || submitting || hasAutoStartedRef.current) {
      return
    }

    hasAutoStartedRef.current = true
    handlePayment()
  }, [autoOpen, notReady, submitting])

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      <Button
        type="button"
        disabled={notReady || submitting}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        className="w-full bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue text-white font-black uppercase tracking-widest text-xs px-10 py-4 rounded-xl hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.5)] transition-all disabled:opacity-50"
        data-testid={dataTestId}
      >
        Place Order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="razorpay-payment-error-message"
      />
    </>
  )
}

const ManualTestPaymentButton = ({ notReady }: { notReady: boolean }) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handlePayment = () => {
    setSubmitting(true)

    onPaymentCompleted()
  }

  return (
    <>
      <Button
        type="button"
        disabled={notReady || submitting}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        className="w-full bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue text-white font-black uppercase tracking-widest text-xs px-10 py-4 rounded-xl hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.5)] transition-all disabled:opacity-50"
        data-testid="submit-order-button"
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

export default PaymentButton

