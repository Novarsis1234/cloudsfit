"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { setShippingMethod } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"

/**
 * Headless component that automatically selects the first available shipping method
 * and moves to the payment step.
 */
export default function ShippingAutoSelect({
  cart,
  availableShippingMethods,
}: {
  cart: HttpTypes.StoreCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const step = searchParams.get("step")

  useEffect(() => {
    const autoSelect = async () => {
      // Check if any items in cart require shipping
      const itemsRequireShipping = cart.items?.some((item: any) => item.requires_shipping) ?? false
      
      console.log(`[ShippingAutoSelect] Items require shipping: ${itemsRequireShipping}`)
      console.log(`[ShippingAutoSelect] Available shipping methods: ${availableShippingMethods.length}`)
      
      // If items don't require shipping, skip directly to payment
      if (!itemsRequireShipping) {
        console.log("[ShippingAutoSelect] No shipping required. Moving to payment step.")
        if (step !== "payment") {
          router.push(pathname + "?step=payment", { scroll: false })
        }
        return
      }
      
      // If no shipping methods available, skip directly to payment
      if (step === "delivery" && availableShippingMethods.length === 0) {
        console.log("No shipping methods available. Skipping to payment.")
        router.push(pathname + "?step=payment", { scroll: false })
        return
      }
      
      // Only run shipping selection if we're on delivery step and items require shipping
      if (step === "delivery" && itemsRequireShipping) {
        console.log("Auto-selecting shipping methods...")
        
        // Identify all unique shipping profiles in the cart
        const requiredProfileIds = Array.from(
          new Set(
            cart.items
              ?.map((item) => {
                const profileId = (item.variant?.product as any)?.shipping_profile_id
                if (!profileId) {
                  console.warn(`Item ${item.id} (${item.variant?.product?.title}) missing shipping_profile_id`)
                }
                return profileId
              })
              .filter(Boolean)
          )
        )

        console.log("Required profiles for cart items:", requiredProfileIds)

        // Identify which profiles already have a selected method
        // We look into SM.shipping_option (which we expanded in retrieveCart)
        const selectedProfileIds = cart.shipping_methods
          ?.map((sm) => (sm as any).shipping_option?.shipping_profile_id)
          .filter(Boolean) || []
        
        console.log("Profiles currently satisfied by selected methods:", selectedProfileIds)

        // Identify profiles that still need a method
        const missingProfileIds = requiredProfileIds.filter(id => !selectedProfileIds.includes(id))

        console.log("Profiles still needing selection:", missingProfileIds)

        // If no profiles are missing, move to payment
        if (missingProfileIds.length === 0 && requiredProfileIds.length > 0) {
          console.log("All required profiles satisfied. Navigating to payment.")
          router.push(pathname + "?step=payment", { scroll: false })
          return
        }

        // Sequential selection for missing profiles
        let anyFail = false
        for (const profileId of missingProfileIds) {
          // Find a method that matches this profile
          const methodForProfile = availableShippingMethods.find(m => 
            (m as any).shipping_profile_id === profileId && m.price_type === "flat"
          ) || availableShippingMethods.find(m => 
            (m as any).shipping_profile_id === profileId
          )
          
          if (methodForProfile) {
            console.log(`Auto-selecting method "${methodForProfile.name}" (${methodForProfile.id}) for profile ${profileId}`)
            try {
              await setShippingMethod({ 
                cartId: cart.id, 
                shippingMethodId: methodForProfile.id 
              })
              // We refresh after each selection or wait for the end? 
              // Refreshing and waiting might be safer to ensure Medusa state updates
            } catch (error) {
              console.error(`Failed to assign shipping method for profile ${profileId}:`, error)
              anyFail = true
            }
          } else {
             console.warn(`CRITICAL: No available shipping method found for profile ${profileId}`)
             anyFail = true
          }
        }

        // Final refresh and navigation if everything was attempted
        if (!anyFail && missingProfileIds.length > 0) {
            console.log("Attempted all selections. Refreshing UI.")
            router.refresh()
            // We'll let the next useEffect cycle handle the navigation to payment 
            // once cart.shipping_methods list is officially updated in the prop.
        }
      }
    }

    autoSelect()
  }, [step, cart.id, JSON.stringify(cart.items), JSON.stringify(cart.shipping_methods), availableShippingMethods, pathname, router])

  return null
}
