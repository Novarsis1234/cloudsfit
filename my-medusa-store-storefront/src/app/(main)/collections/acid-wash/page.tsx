import { Metadata } from "next"

import CollectionPageContent from "@/components/CollectionPageContent"

export const metadata: Metadata = {
  title: "Acid Wash | CloudsFit Store",
  description: "Vintage wash aesthetic - Acid Wash Collection",
}

export default function AcidWashPage() {
  const collectionData = {
    title: "ACID WASH",
    description: "Vintage wash aesthetic",
    handle: "acid-wash",
  }

  return (
    <main className="bg-black min-h-screen pt-0">
      <CollectionPageContent collection={collectionData} />
    </main>
  )
}
