import repeat from "@/lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Table } from "@medusajs/ui"

import Item from "@/modules/cart/components/item"
import SkeletonLineItem from "@/modules/skeletons/components/skeleton-line-item"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  return (
    <div className="flex flex-col gap-y-10">
      <div className="flex items-center gap-x-4">
        <LocalizedClientLink href="/store" className="text-white hover:text-cloudsfit-blue transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </LocalizedClientLink>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white">
          Shopping Cart ({items?.length || 0} {items?.length === 1 ? 'Item' : 'Items'})
        </h1>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {items
          ? items
            .sort((a, b) => {
              return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
            })
            .map((item) => {
              return (
                <Item
                  key={item.id}
                  item={item}
                  currencyCode={cart?.currency_code || "INR"}
                />
              )
            })
          : repeat(5).map((i) => {
            return <SkeletonLineItem key={i} />
          })}
      </div>
    </div>
  )
}

export default ItemsTemplate

