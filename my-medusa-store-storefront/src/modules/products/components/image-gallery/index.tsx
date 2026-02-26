import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"
import { useMemo } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  selectedVariant?: HttpTypes.StoreProductVariant
}

const ImageGallery = ({ images, selectedVariant }: ImageGalleryProps) => {
  const imagesToShow = useMemo(() => {
    const baseImages = (images || []).filter((image) => Boolean(image?.url))

    if (!selectedVariant?.thumbnail) {
      return baseImages
    }

    const merged = [{ id: "variant-thumb", url: selectedVariant.thumbnail }, ...baseImages]
    const seen = new Set<string>()

    return merged.filter((image) => {
      if (!image?.url || seen.has(image.url)) {
        return false
      }
      seen.add(image.url)
      return true
    })
  }, [images, selectedVariant?.thumbnail])

  return (
    <div className="flex items-start relative">
      <div className="flex flex-col flex-1 small:mx-16 gap-y-4">
        {imagesToShow.map((image, index) => {
          return (
            <Container
              key={image.id || index}
              className="relative aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle"
            >
              {!!image.url && (
                <Image
                  src={image.url}
                  priority={index <= 2}
                  className="absolute inset-0 rounded-rounded"
                  alt={`Product image ${index + 1}`}
                  fill
                  sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                  style={{
                    objectFit: "cover",
                  }}
                />
              )}
            </Container>
          )
        })}
      </div>
    </div>
  )
}

export default ImageGallery
