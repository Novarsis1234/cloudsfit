import { Metadata } from "next"

import CollectionPageContent from "@/components/CollectionPageContent"

export const metadata: Metadata = {
  title: "Oversized Tees | CloudsFit Store",
  description: "Loose fit streetwear essentials - Oversized Tees Collection",
}

export default function OversizedTeesPage() {
  const collectionData = {
    title: "OVERSIZED TEES",
    description: "Loose fit streetwear essentials",
    handle: "oversized-tees",
  }

  return (
    <main className="bg-black min-h-screen pt-0">
      <CollectionPageContent collection={collectionData} />
    </main>
  )
}
