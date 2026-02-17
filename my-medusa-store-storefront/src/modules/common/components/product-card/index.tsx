import { HttpTypes } from "@medusajs/types"
import Link from "next/link"
import { Heart, Eye } from "@medusajs/icons"
import Image from "next/image"

type ProductCardProps = {
    product: HttpTypes.StoreProduct
    region: HttpTypes.StoreRegion
}

const ProductCard = ({ product, region }: ProductCardProps) => {
    const variant = product.variants?.[0]
    const price = variant?.calculated_price
    const originalPrice = variant?.original_price
    const hasDiscount = price && originalPrice && price.amount < originalPrice.amount

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: region.currency_code.toUpperCase(),
            minimumFractionDigits: 0,
        }).format(amount / 100)
    }

    return (
        <div className="group relative bg-cloudsfit-dark-light rounded-lg overflow-hidden border border-white/5 hover:border-cloudsfit-purple/50 transition-all duration-300">
            <Link href={`/products/${product.handle}`} className="block">
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    <button className="p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-cloudsfit-purple transition-colors">
                        <Heart className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1 bg-cloudsfit-blue text-white text-xs font-semibold rounded-full">
                        FEATURED
                    </span>
                </div>

                {hasDiscount && (
                    <div className="absolute top-3 right-3 z-10">
                        <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                            -20%
                        </span>
                    </div>
                )}

                {/* Product Image */}
                <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                    {product.thumbnail ? (
                        <Image
                            src={product.thumbnail}
                            alt={product.title || "Product"}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                            No Image
                        </div>
                    )}

                    {/* Quick View Button */}
                    <button className="absolute bottom-3 right-3 p-2 bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Eye className="w-5 h-5" />
                    </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                    <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2 uppercase tracking-wide">
                        {product.title}
                    </h3>

                    <div className="flex items-center gap-2">
                        {price && (
                            <span className="text-lg font-bold text-cloudsfit-purple-light">
                                {formatPrice(price.amount)}
                            </span>
                        )}
                        {hasDiscount && originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                                {formatPrice(originalPrice.amount)}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default ProductCard
