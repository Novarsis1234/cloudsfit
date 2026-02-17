import { Metadata } from "next"

import CollectionPageContent from "@/components/CollectionPageContent"

export const metadata: Metadata = {
  title: "Sweatshirts | CloudsFit Store",
  description: "Clean look for chilly days - Sweatshirts Collection",
}

export default function SweatshirtsPage() {
  const collectionData = {
    title: "SWEATSHIRTS",
    description: "Clean look for chilly days",
    handle: "sweatshirts",
  }

  return (
    <main className="bg-black min-h-screen pt-0">
      <CollectionPageContent collection={collectionData} />
    </main>
  )
}
