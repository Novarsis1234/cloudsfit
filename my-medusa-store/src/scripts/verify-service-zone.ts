
import { MedusaContainer } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function verifyServiceZone({ container }: { container: MedusaContainer }) {
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)

    try {
        const zone = await fulfillmentModuleService.retrieveServiceZone("serzo_01KHZERCDM8C8JYRT7ES2DGQ01", {
            relations: ["geo_zones"]
        })
        console.log("--- SERVICE ZONE CHECK ---")
        console.log(JSON.stringify(zone, null, 2))
    } catch (e) {
        console.error("Verification failed:", e.message)
    }
}
