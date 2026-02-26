
import { MedusaContainer } from "@medusajs/framework/types"

export default async function inspectShipping({ container }: { container: MedusaContainer }) {
    const fulfillmentModuleService = container.resolve("fulfillment")

    try {
        const zones = await fulfillmentModuleService.listShippingZones({}, { relations: ["shipping_options"] })
        console.log("SHIPPING ZONES:", JSON.stringify(zones, null, 2))
    } catch (e) {
        console.error("Error listing zones:", e.message)
    }

    try {
        const options = await fulfillmentModuleService.listShippingOptions({}, { relations: ["type"] })
        console.log("SHIPPING OPTIONS:", JSON.stringify(options, null, 2))
    } catch (e) {
        console.error("Error listing options:", e.message)
    }
}
