import { getPercentageDiff } from "@/lib/util/get-percentage-diff"
import { convertToLocale } from "@/lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"

type LineItemPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  style?: "default" | "tight"
  currencyCode: string
}

const LineItemPrice = ({
  item,
  style = "default",
  currencyCode,
}: LineItemPriceProps) => {
  const originalPrice = item.original_total ?? 0
  const currentPrice = item.total ?? 0
  const hasReducedPrice = currentPrice < originalPrice

  return (
    <div className="flex flex-col items-end gap-1">
      {hasReducedPrice && (
        <div className="flex items-center gap-2">
          <span
            className="text-xs line-through text-gray-500 font-bold"
            data-testid="product-original-price"
          >
            {convertToLocale({
              amount: originalPrice,
              currency_code: currencyCode,
            })}
          </span>
          {style === "default" && (
            <span className="text-[10px] bg-cloudsfit-purple/20 text-cloudsfit-purple px-1.5 py-0.5 rounded-md font-black italic">
              -{getPercentageDiff(originalPrice, currentPrice)}%
            </span>
          )}
        </div>
      )}
      <span
        className={clx("text-xl font-black italic tracking-tighter text-white", {
          "text-cloudsfit-blue": hasReducedPrice,
        })}
        data-testid="product-price"
      >
        {convertToLocale({
          amount: currentPrice,
          currency_code: currencyCode,
        })}
      </span>
    </div>
  )
}

export default LineItemPrice

