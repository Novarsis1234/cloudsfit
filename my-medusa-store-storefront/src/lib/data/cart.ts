"use server"

import { sdk } from "@/lib/config"
import medusaError from "@/lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  removeCartId,
  setCartId,
} from "./cookies"
import { getRegion } from "./regions"
import { getLocale } from "@/lib/data/locale-actions"
import { sanitizeUrls } from "@/lib/util/urls"

/**
 * Retrieves a cart by its ID. If no ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to retrieve.
 * @returns The cart object if found, or null if not found.
 */
export async function retrieveCart(cartId?: string, fields?: string) {
  const id = cartId || (await getCartId())
  fields ??=
    "*items, *region, *payment_collection, *payment_collection.payment_sessions, *shipping_address, *billing_address, *customer, *items.product, *items.variant, *items.thumbnail, *items.metadata, +items.total, *promotions, *shipping_methods"

  if (!id) {
    console.log("[retrieveCart] No cart ID found in cookies or provided.")
    return null
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("carts")),
  }

  try {
    console.log(`[retrieveCart] Fetching cart: ${id}`)
    const { cart } = await sdk.client.fetch<HttpTypes.StoreCartResponse>(
      `/store/carts/${id}`,
      {
        method: "GET",
        query: {
          fields,
        },
        headers,
        next,
        cache: "no-store", // Temporary disable cache to debug 404
      }
    )
    console.log(`[retrieveCart] SUCCESS: Cart ${id}, Items: ${cart.items?.length || 0}, Total: ${cart.total}`)
    console.log(`[retrieveCart] Sanitizing cart data for: ${id}`)
    const sanitizedCart = sanitizeUrls(cart)
    console.log(`[retrieveCart] SUCCESS: Cart ${id}, Items: ${sanitizedCart?.items?.length || 0}, Total: ${sanitizedCart?.total}`)
    return sanitizedCart
  } catch (error: any) {
    const status = error?.response?.status || error?.status
    const message = String(error?.message || error || "")

    // Stale/unauthorized cart IDs are expected occasionally (expired auth, completed cart, old cookie).
    if (status === 401 || status === 403 || status === 404) {
      await removeCartId()
      console.warn(
        `[retrieveCart] Cart ${id} is not accessible anymore (status ${status}). Cookie cart ID removed.`
      )
      return null
    }

    if (message.toLowerCase().includes("fetch failed")) {
      console.warn(`[retrieveCart] Backend unreachable while fetching cart ${id}.`)
      return null
    }

    console.warn(`[retrieveCart] Error fetching cart ${id}:`, message)
    return null
  }
}

export async function getOrSetCart(countryCode: string) {
  const region = await getRegion(countryCode)

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`)
  }

  let cart = await retrieveCart(undefined, "id,region_id,completed_at")

  // If cart is already completed (converted to order), discard it
  if (cart?.completed_at) {
    console.log(`[getOrSetCart] Cart ${cart.id} is already completed. Removing...`)
    await removeCartId()
    cart = null
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  if (!cart) {
    const locale = await getLocale()
    const cartResp = await sdk.store.cart.create(
      { region_id: region.id, locale: locale || undefined },
      {},
      headers
    )
    cart = cartResp.cart

    await setCartId(cart.id)

    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  if (cart && cart?.region_id !== region.id) {
    await sdk.store.cart.update(cart.id, { region_id: region.id }, {}, headers)
    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  return cart
}

export async function updateCart(data: HttpTypes.StoreUpdateCart) {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No existing cart found, please create one before updating")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .update(cartId, data, {}, headers)
    .then(async ({ cart }: { cart: HttpTypes.StoreCart }) => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)

      return cart
    })
    .catch(medusaError)
}

export async function addToCart({
  variantId,
  quantity,
  countryCode,
}: {
  variantId: string
  quantity: number
  countryCode: string
}) {
  if (!variantId) {
    throw new Error("Missing variant ID when adding to cart")
  }

  const cart = await getOrSetCart(countryCode)

  if (!cart) {
    throw new Error("Error retrieving or creating cart")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.cart
    .createLineItem(
      cart.id,
      {
        variant_id: variantId,
        quantity,
      },
      {},
      headers
    )
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch(medusaError)
}

export async function syncCart(items: { variantId: string, quantity: number }[], countryCode: string) {
  const cart = await getOrSetCart(countryCode)
  if (!cart) {
    throw new Error("Error retrieving or creating cart")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  // Retrieve full cart to get item IDs for deletion
  const existingCart = await retrieveCart(cart.id, "*items")

  if (existingCart?.items) {
    console.log(`[syncCart] Clearing ${existingCart.items.length} existing items...`)
    for (const item of existingCart.items) {
      try {
        await sdk.store.cart.deleteLineItem(cart.id, item.id, {}, headers)
      } catch (e) {
        console.error(`Failed to delete item ${item.id}:`, e)
      }
    }
  }

  // Add items one by one in the backend for simplicity in v2 SDK logic
  console.log(`[syncCart] Adding ${items.length} new items...`)
  for (const item of items) {
    try {
      await sdk.store.cart.createLineItem(
        cart.id,
        {
          variant_id: item.variantId,
          quantity: item.quantity,
        },
        {},
        headers
      )
    } catch (e) {
      console.error(`Failed to sync item ${item.variantId}:`, e)
    }
  }

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)
}

export async function updateLineItem({
  lineId,
  quantity,
}: {
  lineId: string
  quantity: number
}) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when updating line item")
  }

  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("Missing cart ID when updating line item")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.cart
    .updateLineItem(cartId, lineId, { quantity }, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch(medusaError)
}

export async function deleteLineItem(lineId: string) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when deleting line item")
  }

  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("Missing cart ID when deleting line item")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.cart
    .deleteLineItem(cartId, lineId, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch(medusaError)
}

export async function setShippingMethod({
  cartId,
  shippingMethodId,
}: {
  cartId: string
  shippingMethodId: string
}) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .addShippingMethod(cartId, { option_id: shippingMethodId }, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
    })
    .catch(medusaError)
}

/**
 * Like setShippingMethod but does NOT call revalidateTag.
 * Safe to use during page render (e.g. in page.tsx) where revalidateTag is forbidden.
 */
export async function ensureShippingMethod({
  cartId,
  shippingMethodId,
}: {
  cartId: string
  shippingMethodId: string
}): Promise<boolean> {
  try {
    const headers = {
      ...(await getAuthHeaders()),
    }
    await sdk.store.cart.addShippingMethod(cartId, { option_id: shippingMethodId }, {}, headers)
    console.log(`[ensureShippingMethod] Successfully set shipping method ${shippingMethodId} on cart ${cartId}`)
    return true
  } catch (e: any) {
    console.warn(`[ensureShippingMethod] Failed to set shipping method:`, e?.message || e)
    return false
  }
}

export async function initiatePaymentSession(
  cart: HttpTypes.StoreCart,
  data: HttpTypes.StoreInitializePaymentSession
) {
  try {
    // Always use a fresh cart from the backend to avoid stale data
    const freshCart = await retrieveCart(cart.id)

    if (!freshCart) {
      return { success: false, error: "Unable to retrieve fresh cart." }
    }

    console.log(`[initiatePaymentSession] Fresh cart retrieved: ${freshCart.id}`)
    console.log(`[initiatePaymentSession] Total: ${freshCart.total}, Currency: ${freshCart.currency_code}`)
    console.log(`[initiatePaymentSession] Email: ${freshCart.email}`)
    console.log(`[initiatePaymentSession] Shipping Methods: ${JSON.stringify((freshCart as any).shipping_methods?.map((m: any) => m.id))}`)

    const normalizePhone = (phone: string | null) => {
      if (!phone) return "9999999999"
      const cleaned = phone.replace(/\D/g, "")
      if (cleaned.length === 10) return `+91${cleaned}`
      if (cleaned.length > 10 && !phone.startsWith("+")) return `+${cleaned}`
      return phone
    }

    const shippingPhone = normalizePhone(freshCart.shipping_address?.phone || null)
    const billingPhone = normalizePhone(freshCart.billing_address?.phone || null)

    console.log(`[initiatePaymentSession] Shipping Address phone: ${shippingPhone}`)
    console.log(`[initiatePaymentSession] Billing Address phone: ${billingPhone}`)

    const headers = {
      ...(await getAuthHeaders()),
    }

    // ── Pre-payment fix: Ensure Phone Number exists ────────────────────────
    // Razorpay requires a phone number. 
    if (freshCart.shipping_address?.phone !== shippingPhone || freshCart.billing_address?.phone !== billingPhone) {
      console.log(`[initiatePaymentSession] Normalizing phone numbers...`)
      try {
        await sdk.store.cart.update(
          freshCart.id,
          {
            shipping_address: {
              ...(freshCart.shipping_address as any),
              phone: shippingPhone
            },
            billing_address: {
              ...(freshCart.billing_address as any),
              phone: billingPhone
            }
          },
          {},
          headers
        )
      } catch (err: any) {
        console.warn(`[initiatePaymentSession] Failed to normalize phone:`, err.message)
      }
    }

    // ── Pre-payment fix: Ensure Billing Address exists ──────────────────────
    // Razorpay plugins often require a billing address to be present on the cart
    // object even if it's identical to shipping.
    if (!freshCart.billing_address && freshCart.shipping_address) {
      console.log(`[initiatePaymentSession] Billing address missing. Cloning from shipping...`)
      try {
        await sdk.store.cart.update(
          freshCart.id,
          {
            billing_address: {
              first_name: freshCart.shipping_address.first_name,
              last_name: freshCart.shipping_address.last_name,
              address_1: freshCart.shipping_address.address_1,
              city: freshCart.shipping_address.city,
              country_code: freshCart.shipping_address.country_code,
              postal_code: freshCart.shipping_address.postal_code,
              phone: freshCart.shipping_address.phone || "9999999999",
            },
          },
          {},
          headers
        )
        console.log(`[initiatePaymentSession] Billing address cloned successfully.`)
      } catch (billErr: any) {
        console.warn(`[initiatePaymentSession] Failed to clone billing address:`, billErr.message)
      }
    }
    // ────────────────────────────────────────────────────────────────────────

    // ── Auto-attach shipping method if cart has none ────────────────────────
    // The Razorpay plugin returns "cart not ready" when the cart has no
    // shipping method, even for free shipping. We fix this here — right before
    // calling the payment provider — so it works regardless of what triggered
    // initiatePaymentSession (page load, useEffect, or direct click).
    const cartShippingCount = (freshCart as any).shipping_methods?.length ?? 0
    if (cartShippingCount === 0) {
      console.log(`[initiatePaymentSession] Cart has no shipping method. Auto-attaching...`)
      try {
        const { shipping_options } = await sdk.client.fetch<{ shipping_options: any[] }>(
          `/store/shipping-options?cart_id=${freshCart.id}`,
          { method: "GET", headers, cache: "no-store" }
        )
        if (shipping_options && shipping_options.length > 0) {
          await sdk.store.cart.addShippingMethod(
            freshCart.id,
            { option_id: shipping_options[0].id },
            {},
            headers
          )
          console.log(`[initiatePaymentSession] Shipping method auto-attached: ${shipping_options[0].id}`)
        } else {
          console.warn(`[initiatePaymentSession] No shipping options available for cart ${freshCart.id}`)
        }
      } catch (shipErr: any) {
        console.warn(`[initiatePaymentSession] Could not auto-attach shipping:`, shipErr?.message)
        // Don't fail — let the payment provider decide
      }
    }
    // ────────────────────────────────────────────────────────────────────────

    console.log(`[initiatePaymentSession] Initializing for cart: ${freshCart.id}, provider: ${data.provider_id}`)

    // ── Wait for sync ───────────────────────────────────────────────────────
    // Sometimes Medusa v2 needs a brief moment to sync the newly added 
    // shipping method or billing address to the persistent storage before 
    // the payment provider's initiatePayment is called.
    await new Promise(resolve => setTimeout(resolve, 500))

    const customer = (freshCart as any).customer || {
      email: freshCart.email,
      first_name: (freshCart as any).shipping_address?.first_name || "Guest",
      last_name: (freshCart as any).shipping_address?.last_name || "User",
      phone: shippingPhone
    }

    // Build a complete cart object for the plugin.
    // We pass extra fields because some plugins are picky about nested structures.
    const cleanCart = {
      ...freshCart,
      currency_code: (freshCart.currency_code || "INR").toUpperCase(),
      shipping_address: freshCart.shipping_address ? {
        ...freshCart.shipping_address,
        phone: shippingPhone
      } : null,
      billing_address: freshCart.billing_address ? {
        ...freshCart.billing_address,
        phone: billingPhone
      } : null,
      customer
    }

    const body = {
      provider_id: data.provider_id,
      data: {
        ...(data as any).data,
        cart: cleanCart,
        extra: cleanCart,
        cart_id: freshCart.id,
        amount: freshCart.total,
        currency: freshCart.currency_code,
        _ts: Date.now(),
        // Redundant context inside data for picky plugins
        context: {
          cart: cleanCart,
          customer: customer
        }
      },
    }

    console.log(`[initiatePaymentSession] Calling Backend Session for: ${data.provider_id}`)

    // ── Payment Collection Management ───────────────────────────────────────
    let paymentCollectionId = (freshCart as any).payment_collection?.id
    if (!paymentCollectionId) {
      console.log(`[initiatePaymentSession] Creating payment collection for cart: ${freshCart.id}, Amount: ${freshCart.total}`)
      try {
        const { payment_collection } = await sdk.client.fetch<any>(`/store/payment-collections`, {
          method: "POST",
          headers,
          body: {
            cart_id: freshCart.id,
            amount: freshCart.total,
            currency_code: freshCart.currency_code
          },
        })
        paymentCollectionId = payment_collection.id
        console.log(`[initiatePaymentSession] Payment collection created: ${paymentCollectionId}`)

        // RE-FETCH cart to ensure the collection is properly linked internally
        const updatedCart = await retrieveCart(freshCart.id)
        if (updatedCart) {
          Object.assign(freshCart, updatedCart)
        }
      } catch (collErr: any) {
        console.error(`[initiatePaymentSession] FAILED to create payment collection:`, collErr.message)
        throw collErr
      }
    }

    const { payment_collection: updatedCollection } = await sdk.client.fetch<any>(
      `/store/payment-collections/${paymentCollectionId}/payment-sessions`,
      {
        method: "POST",
        headers,
        body,
      }
    )

    console.log(`[initiatePaymentSession] SUCCESS for: ${data.provider_id}`)

    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)

    return {
      success: true,
      data: {
        id: updatedCollection.id,
        payment_sessions: updatedCollection.payment_sessions
      }
    }
  } catch (err: any) {
    const errorMessage = err.message || String(err)
    console.error(`[initiatePaymentSession] FAILED for ${data.provider_id}:`, errorMessage)

    return {
      success: false,
      error: errorMessage
    }
  }
}

/**
 * Updates an existing payment session or selects it.
 * This is used to ensure the backend has the latest cart data before Razorpay checkout.
 */
export async function updatePaymentSession(
  paymentCollectionId: string,
  providerId: string,
  data?: any
) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    const cartId = await getCartId()
    if (!cartId) throw new Error("No cart found")

    const cart = await retrieveCart(cartId)
    if (!cart) throw new Error("Unable to retrieve cart")

    console.log(`[updatePaymentSession] Updating session ${providerId} for collection ${paymentCollectionId}`)

    // Create a clean cart for the plugin
    const customer = (cart as any).customer || {
      email: cart.email,
      phone: (cart as any).shipping_address?.phone || (cart as any).billing_address?.phone || "9999999999"
    }

    const cleanCart = {
      id: cart.id,
      total: cart.total,
      currency_code: cart.currency_code,
      email: cart.email,
      shipping_address: {
        first_name: cart.shipping_address?.first_name,
        last_name: cart.shipping_address?.last_name,
        address_1: cart.shipping_address?.address_1,
        city: cart.shipping_address?.city,
        country_code: cart.shipping_address?.country_code,
        phone: cart.shipping_address?.phone,
      },
      billing_address: {
        first_name: cart.billing_address?.first_name,
        last_name: cart.billing_address?.last_name,
        address_1: cart.billing_address?.address_1,
        city: cart.billing_address?.city,
        country_code: cart.billing_address?.country_code,
        phone: cart.billing_address?.phone,
      },
      customer: {
        id: customer.id,
        email: customer.email,
        phone: customer.phone,
      },
    }

    // In Medusa v2, we can call initiatePaymentSession on an existing collection to update/select session
    return await sdk.store.payment.initiatePaymentSession(
      cart as any,
      {
        provider_id: providerId,
        data: {
          ...data,
          extra: cleanCart,
          cart_id: cart.id,
          // Removed top-level context, but passing nested info in data
          customer_details: {
            id: customer.id,
            email: customer.email,
            phone: customer.phone,
          }
        }
      } as any,
      {},
      headers
    ).then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
    })
  } catch (err: any) {
    console.error(`[updatePaymentSession] FAILED:`, err.message)
    // Don't throw, let the caller handle it or proceed to initiate
  }
}

export async function applyPromotions(codes: string[]) {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No existing cart found")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .update(cartId, { promo_codes: codes }, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch(medusaError)
}

export async function applyGiftCard(code: string) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, { gift_cards: [{ code }] }).then(() => {
  //       revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function removeDiscount(code: string) {
  // const cartId = getCartId()
  // if (!cartId) return "No cartId cookie found"
  // try {
  //   await deleteDiscount(cartId, code)
  //   revalidateTag("cart")
  // } catch (error: any) {
  //   throw error
  // }
}

export async function removeGiftCard(
  codeToRemove: string,
  giftCards: any[]
  // giftCards: GiftCard[]
) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, {
  //       gift_cards: [...giftCards]
  //         .filter((gc) => gc.code !== codeToRemove)
  //         .map((gc) => ({ code: gc.code })),
  //     }).then(() => {
  //       revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function submitPromotionForm(
  currentState: unknown,
  formData: FormData
) {
  const code = formData.get("code") as string
  try {
    await applyPromotions([code])
  } catch (e: any) {
    return e.message
  }
}

// TODO: Pass a POJO instead of a form entity here
export async function setAddresses(currentState: unknown, formData: FormData) {
  try {
    if (!formData) {
      throw new Error("No form data found when setting addresses")
    }
    const cartId = getCartId()
    if (!cartId) {
      throw new Error("No existing cart found when setting addresses")
    }

    const data = {
      shipping_address: {
        first_name: formData.get("shipping_address.first_name"),
        last_name: formData.get("shipping_address.last_name"),
        address_1: formData.get("shipping_address.address_1"),
        address_2: "",
        company: formData.get("shipping_address.company"),
        postal_code: formData.get("shipping_address.postal_code"),
        city: formData.get("shipping_address.city"),
        country_code: formData.get("shipping_address.country_code"),
        province: formData.get("shipping_address.province"),
        phone: formData.get("shipping_address.phone"),
      },
      email: formData.get("email"),
    } as any

    const sameAsBilling = formData.get("same_as_billing")
    if (sameAsBilling === "on") data.billing_address = data.shipping_address

    if (sameAsBilling !== "on")
      data.billing_address = {
        first_name: formData.get("billing_address.first_name"),
        last_name: formData.get("billing_address.last_name"),
        address_1: formData.get("billing_address.address_1"),
        address_2: "",
        company: formData.get("billing_address.company"),
        postal_code: formData.get("billing_address.postal_code"),
        city: formData.get("billing_address.city"),
        country_code: formData.get("billing_address.country_code"),
        province: formData.get("billing_address.province"),
        phone: formData.get("billing_address.phone"),
      }
    await updateCart(data)
  } catch (e: any) {
    return e.message
  }

  redirect(`/checkout?step=delivery`)
}

/**
 * Places an order for a cart. If no cart ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to place an order for.
 * @returns The cart object if the order was successful, or null if not.
 */
export async function placeOrder(cartId?: string) {
  const id = cartId || (await getCartId())

  if (!id) {
    throw new Error("No existing cart found when placing an order")
  }

  const headers = {
    ...(await getAuthHeaders()),
    "Idempotency-Key": `complete-cart-${id}`,
  }

  let cartRes: HttpTypes.StoreCompleteCartResponse | undefined
  let lastError: any
  const getLatestCustomerOrderId = async (): Promise<string | null> => {
    try {
      const { customer } = await sdk.client.fetch<{ customer: any }>(
        `/store/customers/me`,
        {
          method: "GET",
          query: {
            fields: "*orders",
          },
          headers,
        }
      )

      const orders = (customer?.orders || []) as Array<{
        id: string
        created_at?: string
      }>

      if (!orders.length) {
        return null
      }

      orders.sort((a, b) => {
        const aTs = a.created_at ? new Date(a.created_at).getTime() : 0
        const bTs = b.created_at ? new Date(b.created_at).getTime() : 0
        return bTs - aTs
      })

      return orders[0]?.id ?? null
    } catch {
      return null
    }
  }

  for (let attempt = 0; attempt < 12; attempt++) {
    try {
      cartRes = await sdk.store.cart.complete(id, {}, headers)
      break
    } catch (error: any) {
      lastError = error
      const status = error?.status
      const message = String(error?.message || "").toLowerCase()
      const isConflict = status === 409
      const isRetryable =
        isConflict ||
        status === 400 ||
        status === 422 ||
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504 ||
        message.includes("already being completed")
      const isLastAttempt = attempt === 11

      if (!isRetryable || isLastAttempt) {
        break
      }

      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)))
    }
  }

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)

  // Fallback: in rare race conditions the cart completion can fail although the
  // order is already created. Recover by redirecting to latest customer order.
  if (!cartRes) {
    const recoveredOrderId = await getLatestCustomerOrderId()
    if (recoveredOrderId) {
      await removeCartId()
      redirect(`/order/${recoveredOrderId}/confirmed`)
    }

    try {
      const { orders } = await sdk.store.order.list(
        {
          limit: 1,
          offset: 0,
          order: "-created_at",
        } as any,
        headers
      )

      if (orders?.length) {
        await removeCartId()
        redirect(`/order/${orders[0].id}/confirmed`)
      }
    } catch {
      // Keep original error behavior below.
    }

    medusaError(lastError)
  }

  if (cartRes?.type === "order") {
    const orderCacheTag = await getCacheTag("orders")
    revalidateTag(orderCacheTag)

    await removeCartId()
    redirect(`/order/${cartRes?.order.id}/confirmed`)
  }

  const recoveredOrderId = await getLatestCustomerOrderId()
  if (recoveredOrderId) {
    await removeCartId()
    redirect(`/order/${recoveredOrderId}/confirmed`)
  }

  return cartRes.cart
}

/**
 * Updates the countrycode param and revalidates the regions cache
 * @param regionId
 * @param countryCode
 */
export async function updateRegion(countryCode: string, currentPath: string) {
  const cartId = await getCartId()
  const region = await getRegion(countryCode)

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`)
  }

  if (cartId) {
    await updateCart({ region_id: region.id })
    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  const regionCacheTag = await getCacheTag("regions")
  revalidateTag(regionCacheTag)

  const productsCacheTag = await getCacheTag("products")
  revalidateTag(productsCacheTag)

  redirect(`${currentPath}`)
}

export async function listCartOptions() {
  const cartId = await getCartId()
  const headers = {
    ...(await getAuthHeaders()),
  }
  const next = {
    ...(await getCacheOptions("shippingOptions")),
  }

  return await sdk.client.fetch<{
    shipping_options: HttpTypes.StoreCartShippingOption[]
  }>("/store/shipping-options", {
    query: { cart_id: cartId },
    next,
    headers,
    cache: "force-cache",
  })
}
