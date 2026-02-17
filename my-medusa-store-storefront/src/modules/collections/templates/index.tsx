import { Suspense } from "react"

import SkeletonProductGrid from "@/modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@/modules/store/components/refinement-list"
import { SortOptions } from "@/modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@/modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"

// Collection descriptions mapping
const collectionDescriptions: Record<string, string> = {
  "regular-tees": "Classic fit for daily wear",
  "oversized-tees": "Loose fit streetwear essentials",
  "acid-wash": "Vintage wash aesthetic",
  "hoodies": "Ultra cozy & premium layering",
  "sweatshirts": "Clean look for chilly days",
}

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const description = collectionDescriptions[collection.handle || ""] || collection.description || ""

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Collection Header Section */}
      <div className="relative bg-gradient-to-r from-purple-900/20 via-black to-teal-900/20 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-cloudsfit-purple text-sm font-bold tracking-widest uppercase">
              ðŸ”µ SHOP COLLECTION
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight uppercase">
            {collection.title}
          </h1>

          {/* Description */}
          {description && (
            <p className="text-gray-400 text-lg">{description}</p>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="w-full lg:w-64 flex-shrink-0">
              <RefinementList sortBy={sort} />
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              <Suspense
                fallback={
                  <SkeletonProductGrid
                    numberOfProducts={collection.products?.length}
                  />
                }
              >
                <PaginatedProducts
                  sortBy={sort}
                  page={pageNumber}
                  collectionId={collection.id}
                  countryCode={countryCode}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

