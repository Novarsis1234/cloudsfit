
import { MedusaContainer } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function fixShippingFinal({ container }: { container: MedusaContainer }) {
    const regionModuleService = container.resolve(Modules.REGION)
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)

    console.log("Starting FINAL shipping fix script...")

    // 1. Get India region
    const regions = await regionModuleService.listRegions({})
    const indiaRegion = regions.find((r: any) => r.name === "India")
    if (!indiaRegion) {
        console.error("India region not found. Please run the previous script first.")
        return
    }
    console.log("Found India region:", indiaRegion.id)

    // 2. Get India shipping zone
    const fulfillmentSets = await fulfillmentModuleService.listFulfillmentSets({}, { relations: ["service_zones"] })
    if (fulfillmentSets.length === 0) {
        console.error("No fulfillment sets found.")
        return
    }
    const fs = fulfillmentSets[0]
    const zone = fs.service_zones?.find((sz: any) => sz.name === "India Shipping Zone")
    if (!zone) {
        console.error("India shipping zone not found.")
        return
    }
    console.log("Found India shipping zone:", zone.id)

    // 3. Get Default shipping profile
    const profiles = await fulfillmentModuleService.listShippingProfiles({})
    const profile = profiles.find((p: any) => p.name === "Default") || profiles[0]
    if (!profile) {
        console.error("No shipping profile found.")
        return
    }
    console.log("Using shipping profile:", profile.id)

    // 4. Create Standard Shipping option (FORCE)
    console.log("Creating Standard Shipping option...")
    try {
        const option = await fulfillmentModuleService.createShippingOptions({
            name: "Standard Shipping",
            price_type: "flat",
            service_zone_id: zone.id,
            shipping_profile_id: profile.id,
            provider_id: "manual",
            type: {
                label: "Standard",
                description: "Standard Delivery",
                code: "standard"
            },
            prices: [
                {
                    currency_code: "inr",
                    amount: 0
                }
            ] as any
        })
        console.log("SUCCESS! Created Standard Shipping option:", option.id)
    } catch (e) {
        console.error("Failed to create shipping option:", e.message)
        if (e.message.includes("already exists") || e.message.includes("duplicate")) {
            console.log("Option seems to exist under a different ID or name. Continuing...")
        }
    }
}
