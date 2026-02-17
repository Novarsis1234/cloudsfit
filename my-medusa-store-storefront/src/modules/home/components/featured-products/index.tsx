import { HttpTypes } from "@medusajs/types"
import PremiumProductCard from "@/modules/common/components/premium-product-card"
import ProductGrid from "@/modules/common/components/product-grid"

type FeaturedProductsProps = {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}

export default async function FeaturedProducts({
  collections,
  region,
}: FeaturedProductsProps) {
  // Get products from first collection
  const products = collections[0]?.products || []

  return (
    <div className="content-container py-16">
      {/* Section Header */}
      <div className="flex flex-col items-center mb-16">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-4 animate-bounce">
          <span className="text-xl">ðŸ”¥</span>
          <span className="text-xs font-black tracking-[0.3em] text-cloudsfit-neon-purple uppercase">
            Most Popular
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-6xl font-black text-center text-white mb-4 uppercase tracking-tighter italic">
          BEST <span className="text-cloudsfit-purple">SELLERS</span>
        </h2>

        {/* Decorative Line */}
        <div className="w-24 h-1.5 bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue rounded-full" />
      </div>

      {/* Products Grid */}
      <div className="mb-16">
        <ProductGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }} gap="lg">
          {products.slice(0, 4).map((product) => (
            <PremiumProductCard key={product.id} product={product} region={region} />
          ))}
        </ProductGrid>
      </div>

      {/* View All Button */}
      <div className="flex justify-center">
        <a
          href="/store"
          className="group relative px-10 py-4 bg-transparent border-2 border-cloudsfit-purple text-white font-black rounded-lg overflow-hidden transition-all duration-300"
        >
          <span className="relative z-10 uppercase tracking-widest text-sm">View All Best Sellers</span>
          <div className="absolute inset-0 bg-cloudsfit-purple transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out -z-0" />
        </a>
      </div>
    </div>
  )
}

