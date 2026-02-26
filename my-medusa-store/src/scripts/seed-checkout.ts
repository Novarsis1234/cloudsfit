
import {
    createShippingOptionsWorkflow,
} from "@medusajs/core-flows"
import { ContainerRegistrationKeys } from "@medusajs/utils"

export default async function seedCheckoutData({ container }) {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    console.log("Seeding Checkout Configuration...")

    const regions = await query.getMany("region", {
        fields: ["id", "name"]
    })

    if (!regions.length) {
        console.error("No regions found.")
        return
    }

    const region = regions[0]

    // We recommend creating/updating shipping options via the Medusa Admin 
    // for better control over fulfillment sets and zones in v2.

    console.log(`Region found: ${region.name} (${region.id})`)
    console.log("To complete setup:")
    console.log("1. Go to Admin -> Settings -> Regions")
    console.log("2. Edit the region and add 'Standard Shipping' with price 0.")
    console.log("3. Ensure 'Razorpay' is the only enabled payment provider.")
}
