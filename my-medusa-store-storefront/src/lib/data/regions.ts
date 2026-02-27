"use server"

import { sdk } from "@/lib/config"
import medusaError from "@/lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  process.env.MEDUSA_BACKEND_URL ||
  "https://cloudsfit-backend.onrender.com"

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
const FALLBACK_REGION_ID =
  process.env.NEXT_PUBLIC_MEDUSA_REGION_ID ||
  process.env.MEDUSA_REGION_ID ||
  "reg_01KHX3RT0CD1REK0GABBPY8S2W"

export const listRegions = async () => {
  const next = {
    ...(await getCacheOptions("regions")),
  }

  try {
    const data = await sdk.client.fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
      next,
      cache: "no-store",
    })

    if (!data || !data.regions) {
      console.error("[listRegions] Unexpected response format:", data)
      return []
    }

    return data.regions
  } catch (error: any) {
    console.error("[listRegions] Error fetching regions:", error.message || error)
    // Fallback to raw fetch in case sdk client request fails.
    try {
      const headers: Record<string, string> = {
        "content-type": "application/json",
      }
      if (PUBLISHABLE_KEY) {
        headers["x-publishable-api-key"] = PUBLISHABLE_KEY
      }

      const res = await fetch(`${BACKEND_URL}/store/regions`, {
        method: "GET",
        headers,
        cache: "no-store",
      })

      if (!res.ok) {
        return []
      }

      const data = (await res.json()) as { regions?: HttpTypes.StoreRegion[] }
      return data?.regions || []
    } catch {
      return []
    }
  }
}

export const retrieveRegion = async (id: string) => {
  const next = {
    ...(await getCacheOptions(["regions", id].join("-"))),
  }

  return sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ region }) => region)
    .catch(medusaError)
}

const regionMap = new Map<string, HttpTypes.StoreRegion>()

export const getRegion = async (countryCode?: string) => {
  try {
    const regions = await listRegions()

    if (!regions || regions.length === 0) {
      console.warn("[getRegion] No regions found on backend. Using fallback India region.")
      return {
        id: FALLBACK_REGION_ID,
        name: "India",
        currency_code: "inr",
        countries: [{ iso_2: "in" }]
      } as HttpTypes.StoreRegion
    }

    console.log(`[getRegion] Found ${regions.length} regions. Searching for: ${countryCode || "in"}`)

    // Default to India (IN) for all requests
    const region = regions.find((r) => r.countries?.some((c) => c.iso_2?.toLowerCase() === "in"))

    if (region) {
      console.log(`[getRegion] Found matching region: ${region.name}`)
      return region
    }

    console.log(`[getRegion] No specific region for 'in' found. Falling back to first region: ${regions[0].name}`)
    return regions[0]
  } catch (e: any) {
    console.error("[getRegion] Error fetching regions:", e.message || e)
    // Absolute fallback for India
    return {
      id: FALLBACK_REGION_ID,
      name: "India",
      currency_code: "inr",
      countries: [{ iso_2: "in" }]
    } as HttpTypes.StoreRegion
  }
}

