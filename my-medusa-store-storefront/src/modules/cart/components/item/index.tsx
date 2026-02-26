"use client"

import { Table, Text, clx } from "@medusajs/ui"
import { updateLineItem } from "@/lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import CartItemSelect from "@/modules/cart/components/cart-item-select"
import ErrorMessage from "@/modules/checkoutold/components/error-message"
import DeleteButton from "@/modules/common/components/delete-button"
import LineItemOptions from "@/modules/common/components/line-item-options"
import LineItemPrice from "@/modules/common/components/line-item-price"
import LineItemUnitPrice from "@/modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import Spinner from "@/modules/common/icons/spinner"
import Thumbnail from "@/modules/products/components/thumbnail"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory

  return (
    <div className="flex flex-col sm:flex-row gap-6 bg-neutral-900/30 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all group relative" data-testid="product-row">
      {/* Thumbnail */}
      <div className="relative w-full sm:w-32 h-64 sm:h-32 bg-neutral-900 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className="w-full h-full block"
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </LocalizedClientLink>
        {updating && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
            <Spinner />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <LocalizedClientLink href={`/products/${item.product_handle}`}>
            <h3 className="text-xl font-black uppercase text-white tracking-tighter leading-tight" data-testid="product-title">
              {item.product_title}
            </h3>
          </LocalizedClientLink>
          <div className="flex flex-wrap gap-2 pt-1 text-[10px] uppercase font-bold tracking-[0.2em] text-gray-500">
            <LineItemOptions variant={item.variant} data-testid="product-variant" />
          </div>
        </div>

        {type === "full" && (
          <div className="flex items-center gap-6 mt-8">
            <div className="flex items-center bg-transparent border border-white/10 rounded-lg overflow-hidden">
              <button
                disabled={item.quantity <= 1 || updating}
                onClick={() => changeQuantity(item.quantity - 1)}
                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/5 disabled:opacity-30 transition-all font-bold text-xl"
              >
                -
              </button>
              <span className="text-sm font-black w-10 text-center text-white">{item.quantity}</span>
              <button
                disabled={item.quantity >= maxQuantity || updating}
                onClick={() => changeQuantity(item.quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/5 disabled:opacity-30 transition-all font-bold text-xl"
              >
                +
              </button>
            </div>

            {error && (
              <div className="ml-2">
                <ErrorMessage error={error} data-testid="product-error-message" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Price (Top Right) and Actions (Bottom Right) */}
      <div className="flex flex-col justify-between items-end min-w-[100px]">
        {/* Price */}
        <div className="text-right">
          <div className="text-xl font-black text-white tracking-tighter">
            <LineItemPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </div>
        </div>

        {/* Delete icon */}
        {type === "full" && (
          <div className="flex items-center p-2 rounded-lg bg-neutral-800/30 hover:bg-neutral-800 transition-colors border border-white/5 opacity-50 hover:opacity-100">
            <DeleteButton id={item.id} data-testid="product-delete-button" />
          </div>
        )}
      </div>
    </div>
  )
}

export default Item

