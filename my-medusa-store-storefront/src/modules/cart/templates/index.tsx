import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@/modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="py-24 bg-black min-h-screen">
      <div className="content-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-testid="cart-container">
        {cart?.items?.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
            <div className="flex flex-col bg-neutral-950/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 sm:p-10 gap-y-10 shadow-2xl">
              {!customer && (
                <div className="bg-neutral-900/50 p-6 rounded-2xl border border-cloudsfit-blue/10">
                  <SignInPrompt />
                </div>
              )}
              <ItemsTemplate cart={cart} />
            </div>
            <div className="lg:sticky lg:top-28">
              <div className="flex flex-col gap-y-8">
                {cart && cart.region && (
                  <div className="bg-neutral-950/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 sm:p-10 shadow-2xl">
                    <Summary cart={cart as any} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate

