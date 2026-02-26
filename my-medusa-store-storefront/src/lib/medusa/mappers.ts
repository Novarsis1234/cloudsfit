
export type MedusaProduct = {
    id: string
    name: string
    handle: string
    subtitle?: string
    description: string
    image: string
    images: string[]
    price: string
    rating: number
    reviews: number
    badges: string[]
    highlights: string[]
    colors: string[]
    sizes: string[]
    collection?: { handle: string }
    variants?: {
        id: string
        title: string
        color: string
        size: string
        price: string
        image?: string
        images?: { url: string }[]
        mediaUrls?: string[]
        metadata?: Record<string, any>
        calculated_amount?: number
        currency_code?: string
    }[]
}

function normalizeMediaEntryToUrl(entry: any): string {
    if (typeof entry === "string") return entry
    if (entry && typeof entry.url === "string") return entry.url
    if (entry && typeof entry.src === "string") return entry.src
    return ""
}

function extractMediaUrlsFromVariant(variant: any): string[] {
    const candidates = [
        variant?.metadata?.media,
        variant?.metadata?.images,
        variant?.metadata?.gallery,
        variant?.media,
    ]

    const urls = candidates
        .filter((value) => Array.isArray(value))
        .flatMap((value: any[]) => value.map(normalizeMediaEntryToUrl))
        .filter((url: string) => Boolean(url))

    return Array.from(new Set(urls))
}

function extractRelationImageUrls(
    variant: any,
    productImageUrlById: Map<string, string>
): string[] {
    if (!Array.isArray(variant?.images)) return []

    const urls = variant.images
        .map((image: any) => {
            if (typeof image === "string") return image
            if (image?.url) return image.url
            if (image?.id && productImageUrlById.has(image.id)) {
                return productImageUrlById.get(image.id) || ""
            }
            return ""
        })
        .filter((url: string) => Boolean(url))

    return Array.from(new Set(urls))
}

function extractVariantImages(
    variant: any,
    productImageUrlById: Map<string, string>
): { url: string }[] {
    const relationUrls = extractRelationImageUrls(variant, productImageUrlById)
    const metadataUrls = extractMediaUrlsFromVariant(variant)
    const urls = Array.from(new Set([...relationUrls, ...metadataUrls]))
    return urls.map((url) => ({ url }))
}

export function mapSingleMedusaProduct(p: any, collectionHandle?: string): MedusaProduct {
    const variants = p.variants || []
    const productOptions = p.options || []
    const optionTitleById: Record<string, string> = {}
    const productImageUrlById = new Map<string, string>(
        (p.images || [])
            .filter((image: any) => Boolean(image?.id) && Boolean(image?.url))
            .map((image: any) => [String(image.id), String(image.url)])
    )

    productOptions.forEach((opt: any) => {
        if (opt?.id && opt?.title) {
            optionTitleById[opt.id] = String(opt.title)
        }
    })

    // Map variants with their specific attributes
    const mappedVariants = variants.map((v: any) => {
        const optionValues = v.options || []
        const variantTitle = String(v?.title || "").trim()
        const titleParts = variantTitle.split("/").map((part: string) => part.trim())
        const productOptionTitles = productOptions.map((opt: any) =>
            String(opt?.title || "").trim().toLowerCase()
        )

        const getOptionTitle = (ov: any) => {
            return (
                ov?.option?.title ||
                optionTitleById[ov?.option_id] ||
                ""
            )
        }

        // Find color and size values for this specific variant
        const colorVal = optionValues.find((ov: any) =>
            getOptionTitle(ov).toLowerCase().includes("color") ||
            getOptionTitle(ov).toLowerCase().includes("colour") ||
            ov.value?.toLowerCase() === "black" || ov.value?.toLowerCase() === "white" // Simple heuristic if labels missing
        )?.value || (
            // Fallback: infer from variant title, e.g. "Red / S"
            titleParts.length >= 2
                ? titleParts[productOptionTitles.findIndex((t: string) => t.includes("color") || t.includes("colour")) >= 0
                    ? productOptionTitles.findIndex((t: string) => t.includes("color") || t.includes("colour"))
                    : 0]
                : "Default"
        )

        const sizeVal = optionValues.find((ov: any) =>
            getOptionTitle(ov).toLowerCase().includes("size") ||
            ["s", "m", "l", "xl", "xxl"].includes(ov.value?.toLowerCase())
        )?.value || (
            // Fallback: infer from variant title, e.g. "Red / S"
            titleParts.length >= 2
                ? titleParts[productOptionTitles.findIndex((t: string) => t.includes("size")) >= 0
                    ? productOptionTitles.findIndex((t: string) => t.includes("size"))
                    : 1]
                : "Default"
        )

        // Handle price for this variant
        let variantPrice = "Price on Request"
        const cp = v.calculated_price
        if (cp && cp.calculated_amount !== undefined) {
            variantPrice = new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: cp.currency_code?.toUpperCase() || "INR",
                minimumFractionDigits: 0,
            }).format(cp.calculated_amount)
        } else if (v.prices?.length > 0) {
            const p0 = v.prices[0]
            variantPrice = new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: p0.currency_code?.toUpperCase() || "INR",
                minimumFractionDigits: 0,
            }).format(p0.amount)
        }

        return {
            id: v.id,
            title: v.title,
            color: colorVal,
            size: sizeVal,
            price: variantPrice,
            // Keep variant image only when Medusa variant thumbnail exists.
            // If we fallback to product thumbnail here, PDP image filtering can collapse to 1 image.
            image: v.thumbnail || undefined,
            images: extractVariantImages(v, productImageUrlById),
            mediaUrls: extractMediaUrlsFromVariant(v),
            metadata: v.metadata || undefined,
            calculated_amount: cp?.calculated_amount,
            currency_code: cp?.currency_code || v.prices?.[0]?.currency_code
        }
    })

    // Find a primary variant for the display price
    let pricedVariant = variants.find((v: any) => v.calculated_price?.calculated_amount !== undefined && v.calculated_price?.calculated_amount !== null)
    if (!pricedVariant) {
        pricedVariant = variants.find((v: any) => v.prices && v.prices.length > 0)
    }
    if (!pricedVariant) {
        pricedVariant = variants[0]
    }

    const calculatedPrice = pricedVariant?.calculated_price
    let formattedPrice = "Price on Request"

    if (calculatedPrice && calculatedPrice.calculated_amount !== undefined) {
        formattedPrice = new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: calculatedPrice.currency_code?.toUpperCase() || "INR",
            minimumFractionDigits: 0,
        }).format(calculatedPrice.calculated_amount)
    } else if (pricedVariant?.prices?.length > 0) {
        const p0 = pricedVariant.prices[0]
        formattedPrice = new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: p0.currency_code?.toUpperCase() || "INR",
            minimumFractionDigits: 0,
        }).format(p0.amount)
    }

    const allImages = p.images?.map((img: any) => img.url) || []
    if (p.thumbnail && !allImages.includes(p.thumbnail)) {
        allImages.unshift(p.thumbnail)
    }

    const uniqueCaseInsensitive = (values: string[]) => {
        const map = new Map<string, string>()
        values.forEach((val) => {
            const normalized = String(val || "").trim()
            if (!normalized) return
            const key = normalized.toLowerCase()
            if (!map.has(key)) {
                map.set(key, normalized)
            }
        })
        return Array.from(map.values())
    }

    // Extract all unique colors and sizes from variants
    const colors = uniqueCaseInsensitive(
        mappedVariants
            .map((variant: { color: string }) => variant.color)
            .filter((color: string) => color && color !== "Default")
    )
    const sizes = uniqueCaseInsensitive(
        mappedVariants
            .map((variant: { size: string }) => variant.size)
            .filter((size: string) => size && size !== "Default")
    )

    // If variants didn't have options set correctly, fall back to product options
    if (colors.length === 0 || sizes.length === 0) {
        const options = p.options || []
        const colorOption = options.find((o: any) => {
            const title = String(o?.title || "").trim().toLowerCase()
            return title.includes("color") || title.includes("colour")
        })
        const sizeOption = options.find((o: any) => {
            const title = String(o?.title || "").trim().toLowerCase()
            return title.includes("size")
        })
        if (colors.length === 0) {
            const vals = uniqueCaseInsensitive(
                (colorOption?.values?.map((v: any) => v.value) || []) as string[]
            )
            if (vals.length > 0) colors.push(...vals)
        }
        if (sizes.length === 0) {
            const vals = uniqueCaseInsensitive(
                (sizeOption?.values?.map((v: any) => v.value) || []) as string[]
            )
            if (vals.length > 0) sizes.push(...vals)
        }
    }

    return {
        id: p.id,
        name: p.title,
        handle: p.handle,
        subtitle: p.subtitle || p.metadata?.subtitle || "",
        description: p.description || "No description available.",
        image: allImages[0] || "/images/placeholder.jpg",
        images: allImages.length > 0 ? allImages : ["/images/placeholder.jpg"],
        price: formattedPrice,
        rating: 4.8,
        reviews: 124,
        badges: ["Bestseller", "Premium Quality"],
        highlights: [
            "100% Premium Cotton",
            "Heavyweight 240 GSM",
            "Sustainable Material",
            "Drop Shoulder Fit"
        ],
        colors: colors.length > 0 ? colors : ["Default"],
        sizes: sizes.length > 0 ? sizes : ["Default"],
        variants: mappedVariants,
        collection: {
            handle: collectionHandle || p.collection?.handle || "shop"
        }
    }
}
