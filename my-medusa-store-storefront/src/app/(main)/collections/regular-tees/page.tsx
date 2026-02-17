import { Metadata } from "next"

import CollectionPageContent from "@/components/CollectionPageContent"

export const metadata: Metadata = {
  title: "Regular Tees | CloudsFit Store",
  description: "Classic fit for daily wear - Regular Tees Collection",
}

export default function RegularTeesPage() {
  const collectionData = {
    title: "REGULAR TEES",
    description: "Classic fit for daily wear",
    handle: "regular-tees",
  }

  return (
    <main className="bg-black min-h-screen pt-0">
      <CollectionPageContent collection={collectionData} />
    </main>
  )
}
