"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { HttpTypes } from "@medusajs/types"

interface CollectionShowcaseProps {
  collections: HttpTypes.StoreCollection[]
}

const CollectionShowcase = ({ collections }: CollectionShowcaseProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // Limit to 4 collections for showcase
  const displayCollections = collections.slice(0, 4)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {displayCollections.map((collection) => (
        <Link
          key={collection.id}
          href={`/collections/${collection.handle}`}
          className="group relative overflow-hidden"
          onMouseEnter={() => setHoveredId(collection.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          {/* Collection Card */}
          <div className="relative aspect-video w-full overflow-hidden bg-gray-200 sm:aspect-square">
            {collection.metadata?.image ? (
              <Image
                src={collection.metadata.image as string}
                alt={collection.title || "Collection"}
                fill
                className={`h-full w-full object-cover transition-transform duration-500 ${
                  hoveredId === collection.id ? "scale-110" : "scale-100"
                }`}
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                <span className="text-gray-600">{collection.title}</span>
              </div>
            )}

            {/* Overlay */}
            <div
              className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
                hoveredId === collection.id ? "opacity-100" : "opacity-60"
              }`}
            />

            {/* Text Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
              <h3 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                {collection.title}
              </h3>
              <p
                className={`mt-4 text-sm transition-opacity duration-300 sm:text-base md:text-lg ${
                  hoveredId === collection.id
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              >
                Explore Collection →
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default CollectionShowcase
