import { getRegion } from "@/lib/data/regions"
import { mapSingleMedusaProduct, MedusaProduct } from "./mappers"

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://cloudsfit-backend.onrender.com"

async function fetchProductById(productId: string, extraParams: Record<string, string> = {}): Promise<any> {
  const query = new URLSearchParams({
    fields: "id,title,subtitle,handle,description,thumbnail,*variants,*variants.images,*variants.options,*variants.options.option,*images,*options,*options.values,*variants.prices",
    ...extraParams,
  })
  const url = `${BACKEND_URL}/store/products/${productId}?${query.toString()}`
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (PUBLISHABLE_KEY) {
    headers["x-publishable-api-key"] = PUBLISHABLE_KEY
  }

  console.log(`[fetchProductById] Fetching: ${url}`)

  const res = await fetch(url, { headers, cache: "no-store" })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    console.error(`[fetchProductById] Error details:`, err)
    throw new Error(`Product fetch failed: ${res.status} – ${JSON.stringify(err)}`)
  }
  const data = await res.json()
  return data.product ?? null
}

export async function getProductById(productId: string): Promise<MedusaProduct | null> {
  try {
    const region = await getRegion()
    let product: any = null

    try {
      if (region?.id) {
        product = await fetchProductById(productId, { region_id: region.id })
      } else {
        throw new Error("No region found")
      }
    } catch (error: any) {
      try {
        product = await fetchProductById(productId)
      } catch (retryError: any) {
        // Fallback fetch also failed, log the error
      }
    }

    if (!product) return null
    return mapSingleMedusaProduct(product)
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error)
    return null
  }
}
