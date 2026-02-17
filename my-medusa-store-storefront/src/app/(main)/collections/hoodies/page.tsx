import { Metadata } from "next"

import CollectionPageContent from "@/components/CollectionPageContent"

export const metadata: Metadata = {
  title: "Oversized Hoodies | CloudsFit Store",
  description: "Ultra cozy & premium layering - Oversized Hoodies Collection",
}

export default function HoodiesPage() {
  const collectionData = {
    title: "OVERSIZED HOODIES",
    description: "Ultra cozy & premium layering",
    handle: "hoodies",
  }

  return (
    <main className="bg-black min-h-screen pt-0">
      <CollectionPageContent collection={collectionData} />
    </main>
  )
}
