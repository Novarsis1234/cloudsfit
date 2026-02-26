
import { MedusaContainer } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function dumpFulfillment({ container }: { container: MedusaContainer }) {
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)

    try {
        const fs = await fulfillmentModuleService.listFulfillmentSets({}, { relations: ["service_zones", "service_zones.shipping_options"] })
        console.log("DUMP FS:", JSON.stringify(fs, null, 2))

        const options = await fulfillmentModuleService.listShippingOptions({}, { relations: ["service_zone", "type"] })
        console.log("DUMP OPTIONS:", JSON.stringify(options, null, 2))

        const zones = await fulfillmentModuleService.listServiceZones({})
        console.log("DUMP ZONES:", JSON.stringify(zones, null, 2))
    } catch (e) {
        console.error("Dump failed:", e.message)
    }
}
