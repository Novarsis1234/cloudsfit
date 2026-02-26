import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@/lib/data/products"
import { getRegion } from "@/lib/data/regions"
import ProductTemplate from "@/modules/products/templates"
import { HttpTypes } from "@medusajs/types"

type Props = {
  params: Promise<{ handle: string }>
  searchParams: Promise<{ v_id?: string }>
}

export async function generateStaticParams() {
  const countryCode = "in"

  try {
    const { response } = await listProducts({
      countryCode,
      queryParams: { limit: 100, fields: "handle" },
    })

    return response.products
      .map((product) => ({
        handle: product.handle,
      }))
      .filter((param) => param.handle)
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

function getImagesForVariant(
  product: HttpTypes.StoreProduct,
  selectedVariantId?: string
) {
  if (!selectedVariantId || !product.variants) {
    return product.images || []
  }

  const variant = product.variants!.find((v) => v.id === selectedVariantId)
  if (!variant || !variant.images || !variant.images.length) {
    return product.images || []
  }

  const imageIds = new Set(
    variant.images
      .map((image) => image.id)
      .filter((id): id is string => Boolean(id))
  )
  const imageUrls = new Set(
    variant.images
      .map((image) => image.url)
      .filter((url): url is string => Boolean(url))
  )

  const filteredImages = (product.images || []).filter(
    (image) =>
      (image.id && imageIds.has(image.id)) ||
      (image.url && imageUrls.has(image.url))
  )

  if (filteredImages.length) {
    return filteredImages
  }

  if (imageUrls.size) {
    return Array.from(imageUrls).map((url, index) => ({
      id: `variant-url-${index}`,
      url,
      rank: index,
    })) as HttpTypes.StoreProductImage[]
  }

  if (variant.thumbnail) {
    return [
      {
        id: "variant-thumb",
        url: variant.thumbnail,
        rank: 0,
      },
    ] as HttpTypes.StoreProductImage[]
  }

  return product.images || []
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const countryCode = "in"
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  return {
    title: `${product.title} | Medusa Store`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | Medusa Store`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams
  const countryCode = "in"
  const region = await getRegion(countryCode)

  const selectedVariantId = searchParams.v_id

  if (!region) {
    notFound()
  }

  const pricedProduct = await listProducts({
    countryCode,
    queryParams: { handle: params.handle },
  }).then(({ response }) => response.products[0])

  if (!pricedProduct) {
    notFound()
  }

  const images = getImagesForVariant(pricedProduct, selectedVariantId)
  const selectedVariant = pricedProduct.variants?.find(
    (variant) => variant.id === selectedVariantId
  )

  return (
    <ProductTemplate
      product={pricedProduct}
      region={region}
      countryCode={countryCode}
      images={images}
      selectedVariant={selectedVariant}
    />
  )
}
