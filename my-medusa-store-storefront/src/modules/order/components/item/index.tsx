import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

import LineItemOptions from "@/modules/common/components/line-item-options"
import LineItemPrice from "@/modules/common/components/line-item-price"
import LineItemUnitPrice from "@/modules/common/components/line-item-unit-price"
import Thumbnail from "@/modules/products/components/thumbnail"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  currencyCode: string
}

const Item = ({ item, currencyCode }: ItemProps) => {
  return (
    <div className="flex items-center gap-x-4 group" data-testid="product-row">
      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 shadow-xl transition-transform group-hover:scale-105">
        <Thumbnail thumbnail={item.thumbnail} size="square" />
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <Text
          className="text-white font-black text-lg tracking-tighter"
          data-testid="product-name"
        >
          {item.product_title}
        </Text>
        <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">
          <LineItemOptions variant={item.variant} data-testid="product-variant" />
        </div>
      </div>

      <div className="flex flex-col items-end justify-center">
        <div className="flex items-center gap-x-1.5 text-xs font-bold uppercase tracking-widest text-white/40">
          <span data-testid="product-quantity">{item.quantity}</span>
          <span className="text-[10px]">×</span>
          <LineItemUnitPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
            className="text-white/60"
          />
        </div>

        <LineItemPrice
          item={item}
          style="tight"
          currencyCode={currencyCode}
          className="text-white font-black text-base tracking-tighter mt-1"
        />
      </div>
    </div>
  )
}

export default Item
