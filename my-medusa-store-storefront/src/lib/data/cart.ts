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
    "*items, *region, *payment_collection, *payment_collection.payment_sessions, *shipping_address, *billing_address, *customer, *items.product, *items.variant, *items.thumbnail, *items.metadata, +items.total, *promotions, +shipping_methods.name"

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
    return sanitizeUrls(cart)
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

export async function initiatePaymentSession(
  cart: HttpTypes.StoreCart,
  data: HttpTypes.StoreInitializePaymentSession
) {
  // Always use a fresh cart from the backend to avoid stale data
  const freshCart = await retrieveCart(cart.id)

  if (!freshCart) {
    throw new Error("Unable to retrieve fresh cart for payment session initiation.")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  console.log(`[initiatePaymentSession] Initializing for cart: ${freshCart.id}, provider: ${data.provider_id}`)
  console.log(`[initiatePaymentSession] Cart total: ${freshCart.total}, Currency: ${freshCart.currency_code}`)

  return sdk.store.payment
    .initiatePaymentSession(
      freshCart.id as any, // FIX: Pass ID string, cast to any in case types are wrong but backend expects ID
      {
        ...data,
        // Pass essential cart data only to avoid massive object serialization issues
        data: {
          ...(data as any).data,
          extra: {
            id: freshCart.id,
            total: freshCart.total,
            currency_code: freshCart.currency_code,
            email: freshCart.email,
            shipping_address: freshCart.shipping_address,
          } as any,
        },
      },
      {},
      headers
    )
    .then(async (resp: any) => {
      console.log(`[initiatePaymentSession] SUCCESS for provider: ${data.provider_id}`)
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      return resp
    })
    .catch((err: any) => {
      console.error(`[initiatePaymentSession] FAILED for provider: ${data.provider_id}`)
      console.error(`[initiatePaymentSession] Error:`, err.message || err)
      if (err.response) {
        console.error(`[initiatePaymentSession] Response status:`, err.response.status)
        console.error(`[initiatePaymentSession] Response body:`, JSON.stringify(err.response.data))
      }
      return medusaError(err)
    })
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
