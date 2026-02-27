"use client"

import { isManual, isStripeLike, isRazorpay } from "@lib/constants"
import { placeOrder, updatePaymentSession } from "@lib/data/cart"
import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useState, useEffect } from "react"
import ErrorMessage from "../error-message"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]

  switch (true) {
    case isStripeLike(paymentSession?.provider_id):
      return (
        <StripePaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isManual(paymentSession?.provider_id):
      return (
        <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
      )
    case isRazorpay(paymentSession?.provider_id):
      return (
        <RazorpayPaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    default:
      return <Button disabled>Select a payment method</Button>
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
        if (err?.message?.includes("NEXT_REDIRECT") || err?.digest?.includes("NEXT_REDIRECT")) {
          return
        }
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

const ManualTestPaymentButton = ({ notReady }: { notReady: boolean }) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        if (err?.message?.includes("NEXT_REDIRECT") || err?.digest?.includes("NEXT_REDIRECT")) {
          return
        }
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

const RazorpayPaymentButton = ({
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
  const [razorpayResponse, setRazorpayResponse] = useState<any>(null)

  // Ensure scroll is always restored on component mount and unmount
  useEffect(() => {
    // Restore scroll on mount
    document.body.style.overflow = "auto"
    document.documentElement.style.overflow = "auto"

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "auto"
      document.documentElement.style.overflow = "auto"
    }
  }, [])

  // Restore scroll whenever submitting changes to false
  useEffect(() => {
    if (!submitting) {
      document.body.style.overflow = "auto"
      document.documentElement.style.overflow = "auto"
    }
  }, [submitting])

  const onPaymentCompleted = async (razorpayData: any) => {
    console.log("Payment successful, completing order...")
    console.log("Razorpay payment data:", razorpayData)

    // Update payment session with Razorpay payment details
    try {
      if (razorpayData && cart.payment_collection) {
        const session = cart.payment_collection.payment_sessions?.find(
          (s) => s.status === "pending"
        )

        if (session) {
          console.log("Updating payment session with Razorpay payment ID:", razorpayData.razorpay_payment_id)
          await updatePaymentSession(
            cart.payment_collection.id,
            session.provider_id,
            razorpayData
          )
        }
      }
    } catch (updateError) {
      console.error("Error updating payment session:", updateError)
      // Continue anyway as payment was successful
    }

    await placeOrder()
      .then(() => {
        console.log("Order placed successfully.")
      })
      .catch((err) => {
        if (err?.message?.includes("NEXT_REDIRECT") || err?.digest?.includes("NEXT_REDIRECT")) {
          return
        }
        console.error("Error placing order:", err)
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handlePayment = async () => {
    setSubmitting(true)
    setErrorMessage(null)

    try {
      console.log("Ensuring payment session exists for Razorpay...")
      // 🔥 Ensure payment session exists and is selected
      await sdk.store.payment.initiatePaymentSession(cart as any, {
        provider_id: "pp_razorpay_razorpay",
      })

      // Refetch updated cart to get the new session
      const { cart: updatedCart } = await sdk.store.cart.retrieve(cart.id, {
        fields: "*payment_collection.payment_sessions",
      })

      const session = updatedCart.payment_collection?.payment_sessions?.find(
        (s: any) => s.provider_id === "pp_razorpay_razorpay"
      )

      if (!session) {
        console.error("No active payment session found")
        setErrorMessage("Payment session not initialized. Please refresh the page and try again.")
        setSubmitting(false)
        document.body.style.overflow = "auto"
        return
      }

      const loadScript = (src: string) => {
        return new Promise((resolve) => {
          const script = document.createElement("script")
          script.src = src
          script.onload = () => {
            resolve(true)
          }
          script.onerror = () => {
            resolve(false)
          }
          document.body.appendChild(script)
        })
      }

      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

      if (!res) {
        setErrorMessage("Razorpay SDK failed to load. Are you online?")
        setSubmitting(false)
        document.body.style.overflow = "auto"
        return
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
        amount: (session.data as any).amount, // Use the EXACT amount from the order created in backend
        currency: (session.data as any).currency || cart.currency_code.toUpperCase(),
        name: "Goushakti",
        description: "Order Payment",
        order_id: (session.data as any).id, // This is the razorpay order_id from backend
        handler: async function (response: any) {
          console.log("Razorpay handler callback triggered:", response)
          // Explicitly restore scroll in case the handler is called while modal still shutting down
          document.body.style.overflow = "auto"
          document.documentElement.style.overflow = "auto"

          // Pass the Razorpay response to onPaymentCompleted
          onPaymentCompleted(response)
        },
        prefill: {
          name: cart.billing_address?.first_name + " " + cart.billing_address?.last_name,
          email: cart.email,
          contact: cart.shipping_address?.phone,
        },
        notes: {
          address: cart.shipping_address?.address_1,
        },
        theme: {
          color: "#1b4d3e",
        },
        modal: {
          ondismiss: () => {
            console.log("Razorpay modal dismissed by user")
            // CRITICAL: Restore page scroll and interaction
            document.body.style.overflow = "auto"
            document.documentElement.style.overflow = "auto"
            setSubmitting(false)
          },
        },
      }

      if (!options.order_id) {
        setErrorMessage("Razorpay error: order_id is missing. Please check backend integration.")
        setSubmitting(false)
        document.body.style.overflow = "auto"
        document.documentElement.style.overflow = "auto"
        return
      }

      const rzp1 = new (window as any).Razorpay(options)
      rzp1.on("payment.failed", function (response: any) {
        console.error("Razorpay payment failed:", response.error)
        setErrorMessage(response.error.description)
        // Explicitly restore scroll
        document.body.style.overflow = "auto"
        document.documentElement.style.overflow = "auto"
        setSubmitting(false)
      })

      console.log("Opening Razorpay modal...")
      // Ensure body scroll is enabled before opening modal
      document.body.style.overflow = "auto"
      document.documentElement.style.overflow = "auto"
      rzp1.open()
    } catch (error: any) {
      console.error("Error in handlePayment:", error)
      setErrorMessage(error?.message || "Failed to initialize payment. Please try again.")
      setSubmitting(false)
      document.body.style.overflow = "auto"
      document.documentElement.style.overflow = "auto"
    }
  }

  return (
    <>
      <Button
        type="button"
        disabled={notReady || submitting}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid={dataTestId}
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="razorpay-payment-error-message"
      />
    </>
  )
}

export default PaymentButton
