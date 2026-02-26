import { getBaseURL } from "@/lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import { CartProvider } from "@/lib/context/cart-context"
import { WishlistProvider } from "@/lib/context/wishlist-context"
import { AccountProvider } from "@/lib/context/account-context"

export const metadata: Metadata = {
    metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
    return (
        <html lang="en" data-mode="light">
            <body>
                <AccountProvider>
                    <CartProvider>
                        <WishlistProvider>
                            <main className="relative pt-24 sm:pt-28 md:pt-24">{props.children}</main>
                        </WishlistProvider>
                    </CartProvider>
                </AccountProvider>
            </body>
        </html>
    )
}
