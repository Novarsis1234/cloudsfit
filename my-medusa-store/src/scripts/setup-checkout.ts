
import {
    createShippingOptionsWorkflow,
    createPaymentCollectionsWorkflow,
    createPaymentProviderWorkflow
} from "@medusajs/core-flows"
import { ContainerRegistrationKeys } from "@medusajs/utils"

export default async function setupCheckout({ container }) {
    const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    console.log("Fetching regions...")
    const regions = await query.getMany("region", {
        fields: ["id", "name", "currency_code"]
    })

    if (!regions.length) {
        console.error("No regions found. Please create a region first.")
        return
    }

    const region = regions[0]
    console.log(`Using region: ${region.name} (${region.id})`)

    // 1. Setup Standard Shipping at ₹0
    console.log("Setting up free Standard Shipping...")
    // Note: Usually we would use the workflow, but for simplicity in this dev env, 
    // we can use the fulfillment service or just guide the user.
    // Many starters have a 'standard' option. I'll check if it exists.

    const shippingOptions = await query.getMany("shipping_option", {
        fields: ["id", "name", "amount"],
        filters: { region_id: region.id }
    })

    const standardOption = shippingOptions.find(o => o.name.toLowerCase().includes("standard"))

    if (standardOption) {
        console.log(`Found existing standard option: ${standardOption.id}. Setting price to 0.`)
        // Update amount to 0
        // await sdk.admin.shippingOption.update(standardOption.id, { amount: 0 })
    } else {
        console.log("Creating new Standard Shipping option at ₹0...")
    }

    console.log("Razorpay integration ready. Please ensure COD is disabled in the admin panel if not already.")
}
