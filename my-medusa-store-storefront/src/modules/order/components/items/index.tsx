import { HttpTypes } from "@medusajs/types"
import Item from "@/modules/order/components/item"

type ItemsProps = {
  order: HttpTypes.StoreOrder
}

const Items = ({ order }: ItemsProps) => {
  const items = order.items

  return (
    <div className="flex flex-col gap-y-4 border-t border-white/5 pt-8">
      <h2 className="text-sm font-black uppercase tracking-widest text-white/30">Products</h2>
      <div className="flex flex-col gap-y-6" data-testid="products-table">
        {items?.length && items
          .sort((a, b) => {
            return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
          })
          .map((item) => {
            return (
              <Item
                key={item.id}
                item={item}
                currencyCode={order.currency_code}
              />
            )
          })
        }
      </div>
    </div>
  )
}

export default Items
