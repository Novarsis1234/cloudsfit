"use client"

import { Badge, Heading, Input, Label, Text } from "@medusajs/ui"
import React from "react"

import { applyPromotions } from "@/lib/data/cart"
import { convertToLocale } from "@/lib/util/money"
import { HttpTypes } from "@medusajs/types"
import Trash from "@/modules/common/icons/trash"
import ErrorMessage from "../error-message"
import { SubmitButton } from "../submit-button"

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")

  const { promotions = [] } = cart
  const removePromotionCode = async (code: string) => {
    const validPromotions = promotions.filter(
      (promotion) => promotion.code !== code
    )

    await applyPromotions(
      validPromotions.filter((p) => p.code !== undefined).map((p) => p.code!)
    )
  }

  const addPromotionCode = async (formData: FormData) => {
    setErrorMessage("")

    const code = formData.get("code")
    if (!code) {
      return
    }
    const input = document.getElementById("promotion-input") as HTMLInputElement
    const codes = promotions
      .filter((p) => p.code !== undefined)
      .map((p) => p.code!)
    codes.push(code.toString())

    try {
      await applyPromotions(codes)
    } catch (e: any) {
      setErrorMessage(e.message)
    }

    if (input) {
      input.value = ""
    }
  }

  return (
    <div className="w-full bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex flex-col shadow-xl">
      <div className="txt-medium">
        <form action={(a) => addPromotionCode(a)} className="w-full">
          <div className="flex items-center justify-between mb-2">
            <Label className="flex gap-x-1 items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="text-sm font-bold uppercase tracking-widest text-white/50 hover:text-cloudsfit-blue transition-colors"
                data-testid="add-discount-button"
              >
                {isOpen ? "Close Promotion" : "Add Promotion Code"}
              </button>
            </Label>
          </div>

          {isOpen && (
            <div className="flex flex-col gap-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex w-full gap-x-2">
                <Input
                  className="bg-black/60 border-white/10 text-white rounded-xl focus:border-cloudsfit-blue/50 flex-1"
                  id="promotion-input"
                  name="code"
                  placeholder="Enter code"
                  type="text"
                  autoFocus={false}
                  data-testid="discount-input"
                />
                <SubmitButton
                  variant="secondary"
                  className="bg-cloudsfit-blue/10 border border-cloudsfit-blue/20 text-cloudsfit-blue px-6 hover:bg-cloudsfit-blue/20 transition-all rounded-xl"
                  data-testid="discount-apply-button"
                >
                  Apply
                </SubmitButton>
              </div>

              <ErrorMessage
                error={errorMessage}
                data-testid="discount-error-message"
              />
            </div>
          )}
        </form>

        {promotions.length > 0 && (
          <div className="w-full flex items-center mt-6 pt-6 border-t border-white/5">
            <div className="flex flex-col w-full gap-y-3">
              <Heading className="text-xs font-bold uppercase tracking-widest text-white/30 mb-2">
                Applied Promotions
              </Heading>

              {promotions.map((promotion) => {
                return (
                  <div
                    key={promotion.id}
                    className="flex items-center justify-between w-full bg-cloudsfit-blue/5 border border-cloudsfit-blue/20 rounded-xl px-4 py-3"
                    data-testid="discount-row"
                  >
                    <div className="flex items-center gap-x-3">
                      <span className="text-white font-black uppercase tracking-tighter" data-testid="discount-code">
                        {promotion.code}
                      </span>
                      <span className="text-xs text-cloudsfit-blue/70 font-bold">
                        {promotion.application_method?.value !== undefined && (
                          <>
                            {promotion.application_method.type === "percentage"
                              ? `${promotion.application_method.value}% OFF`
                              : `- ${convertToLocale({
                                amount: +promotion.application_method.value,
                                currency_code: promotion.application_method.currency_code || "inr",
                              })}`}
                          </>
                        )}
                      </span>
                    </div>
                    {!promotion.is_automatic && (
                      <button
                        className="text-white/30 hover:text-red-500 transition-colors p-2"
                        onClick={() => {
                          if (!promotion.code) return
                          removePromotionCode(promotion.code)
                        }}
                        data-testid="remove-discount-button"
                      >
                        <Trash size={16} />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscountCode

