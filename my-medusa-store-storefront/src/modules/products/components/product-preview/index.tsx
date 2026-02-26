import { Text } from "@medusajs/ui"
import { listProducts } from "@/lib/data/products"
import { getProductPrice } from "@/lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  // const pricedProduct = await listProducts({
  //   regionId: region.id,
  //   queryParams: { id: [product.id!] },
  // }).then(({ response }) => response.products[0])

  // if (!pricedProduct) {
  //   return null
  // }

  const { cheapestPrice } = getProductPrice({
    product,
  })

  // Extract unique sizes and colors from product options
  const sizeOption = product.options?.find((opt) => opt.title.toLowerCase() === "size")
  const colorOption = product.options?.find((opt) => opt.title.toLowerCase() === "color")
  const sizes = sizeOption?.values?.map((v) => v.value || v) || []
  const colors = colorOption?.values?.map((v) => v.value || v) || []

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group block h-full">
      <div data-testid="product-wrapper" className="h-full flex flex-col">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          isFeatured={isFeatured}
        />
        <div className="flex flex-col flex-1 mt-4 justify-between">
          <Text 
            className="text-sm md:text-base font-medium text-white/90 group-hover:text-cloudsfit-neon-blue transition-colors duration-200 line-clamp-2 uppercase tracking-wide" 
            data-testid="product-title"
          >
            {product.title}
          </Text>
          <div className="flex items-center gap-x-3 mt-3">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
          {sizes.length > 0 && (
            <div className="mt-2 text-xs text-white/70">
              Sizes: {sizes.join(", ")}
            </div>
          )}
          {colors.length > 0 && (
            <div className="mt-1 text-xs text-white/70">
              Colors: {colors.join(", ")}
            </div>
          )}
        </div>
      </div>
    </LocalizedClientLink>
  )
}

