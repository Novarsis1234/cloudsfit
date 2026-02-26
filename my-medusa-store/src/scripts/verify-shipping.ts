
import { MedusaContainer } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function verifyShipping({ container }: { container: MedusaContainer }) {
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)
    const pricingModuleService = container.resolve(Modules.PRICING)

    const options = await fulfillmentModuleService.listShippingOptions({}, { relations: ["service_zone", "type"] })
    console.log("SHIPPING OPTIONS:", JSON.stringify(options, null, 2))

    const profiles = await fulfillmentModuleService.listShippingProfiles({})
    console.log("SHIPPING PROFILES:", JSON.stringify(profiles, null, 2))
}
