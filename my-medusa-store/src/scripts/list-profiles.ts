
import { MedusaContainer } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function listProfiles({ container }: { container: MedusaContainer }) {
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)

    try {
        const profiles = await fulfillmentModuleService.listShippingProfiles({})
        console.log("--- SHIPPING PROFILES ---")
        console.log(JSON.stringify(profiles, null, 2))
    } catch (e) {
        console.error("Listing profiles failed:", e.message)
    }
}
