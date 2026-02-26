import { sdk } from "@/lib/config"
import { getRegion } from "@/lib/data/regions"
import { mapSingleMedusaProduct, MedusaProduct } from "./mappers"

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

// Direct fetch helper — bypasses SDK wrapper to avoid "Missing required pricing context" suppression
async function fetchProducts(params: Record<string, string | string[]>): Promise<any[]> {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach(v => query.append(key + "[]", v))
    } else {
      query.set(key, value)
    }
  }

  const url = `${BACKEND_URL}/store/products?${query.toString()}`
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  if (PUBLISHABLE_KEY) {
    headers["x-publishable-api-key"] = PUBLISHABLE_KEY
  }

  const res = await fetch(url, { headers, cache: "no-store" })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Products fetch failed: ${res.status} – ${JSON.stringify(err)}`)
  }
  const data = await res.json()
  return data.products || []
}

export async function getProducts(
  collectionHandle: string
): Promise<MedusaProduct[]> {
  try {
    const region = await getRegion()

    const cleanHandle = collectionHandle.replace(/^\/+/, "").trim()

    // Step 1 — Get collection
    const { collections: allCollections } = await sdk.store.collection.list()
    const collection = allCollections?.find(c => c.handle?.trim() === cleanHandle)

    if (!collection) {
      console.warn(`Collection not found: ${cleanHandle}`)
      return fetchGenericProducts(cleanHandle, region?.id)
    }

    // Step 2 — Fetch products with prices
    let products: any[] = []
    try {
      if (region?.id) {
        products = await fetchProducts({
          collection_id: collection.id,
          region_id: region.id,
          fields: "id,title,subtitle,handle,description,thumbnail,*variants,*variants.images,*variants.options,*variants.options.option,*images,*options,*options.values,*variants.prices",
          limit: "50",
        })
        console.log(`[getProducts] Fetched ${products.length} products with pricing for "${cleanHandle}"`)
      } else {
        throw new Error("Missing region_id for pricing")
      }
    } catch (error: any) {
      console.error(`[getProducts] Priced fetch failed for "${cleanHandle}":`, error.message || error)
      try {
        products = await fetchProducts({
          collection_id: collection.id,
          fields: "id,title,subtitle,handle,description,thumbnail,*variants,*variants.images,*variants.options,*variants.options.option,*images,*options,*options.values,*variants.prices",
          limit: "50",
        })
      } catch (retryError) {
        console.error("Retry fetch also failed:", retryError)
      }
    }

    return products.map(p => mapSingleMedusaProduct(p, cleanHandle))
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

async function fetchGenericProducts(
  type: string,
  regionId?: string
): Promise<MedusaProduct[]> {
  try {
    let products: any[] = []
    try {
      if (regionId) {
        products = await fetchProducts({
          region_id: regionId,
          fields: "id,title,subtitle,handle,description,thumbnail,*variants,*variants.images,*variants.options,*variants.options.option,*images,*options,*options.values,*variants.prices",
          limit: "20",
        })
      } else {
        throw new Error("Missing region_id for pricing")
      }
    } catch (error: any) {
      console.error(`[fetchGenericProducts] Priced fetch failed:`, error.message || error)
      try {
        products = await fetchProducts({
          fields: "id,title,subtitle,handle,description,thumbnail,*variants,*variants.images,*variants.options,*variants.options.option,*images,*options,*options.values,*variants.prices",
          limit: "20",
        })
      } catch (retryError) {
        console.error("Generic retry fetch also failed:", retryError)
      }
    }

    return products.map(p => mapSingleMedusaProduct(p, type))
  } catch (error) {
    console.error(`Error fetching generic products for ${type}:`, error)
    return []
  }
}

export async function searchProducts(query: string): Promise<MedusaProduct[]> {
  if (!query || query.length < 1) return []

  try {
    const region = await getRegion()

    let products: any[] = []
    try {
      if (region?.id) {
        products = await fetchProducts({
          q: query,
          region_id: region.id,
          fields: "id,title,subtitle,handle,description,thumbnail,*variants,*variants.images,*variants.options,*variants.options.option,*images,*options,*options.values,*variants.prices,*collection",
        })
      } else {
        throw new Error("Missing region_id for pricing")
      }
    } catch (error: any) {
      console.error(`[searchProducts] Priced search failed:`, error.message || error)
      try {
        products = await fetchProducts({
          q: query,
          fields: "id,title,subtitle,handle,description,thumbnail,*variants,*variants.images,*variants.options,*variants.options.option,*images,*options,*options.values,*variants.prices,*collection",
        })
      } catch (retryError) {
        console.error("Search retry also failed:", retryError)
      }
    }

    const filteredProducts = products.filter(p =>
      p.title?.toLowerCase().includes(query.toLowerCase())
    )

    return filteredProducts.map(p => mapSingleMedusaProduct(p, p.collection?.handle || "search"))
  } catch (error) {
    console.error("Error searching products:", error)
    return []
  }
}
