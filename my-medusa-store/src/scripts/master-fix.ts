
import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function masterFix({ container }: { container: MedusaContainer }) {
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)
    const regionModuleService = container.resolve(Modules.REGION)
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
    const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

    console.log("Starting MASTER FIX...")

    try {
        const regionId = "reg_01KHX3RT0CD1REK0GABBPY8S2W" // India
        const serviceZoneId = "serzo_01KHZERCDM8C8JYRT7ES2DGQ01" // India Shipping Zone

        // 1. Add Geo Zone to Service Zone
        console.log("Adding India geo-zone to Service Zone...")
        await fulfillmentModuleService.updateServiceZones(serviceZoneId, {
            geo_zones: [
                {
                    type: "country",
                    country_code: "in"
                }
            ]
        })
        console.log("Geo-zone added.")

        // 2. Link Payment Provider to Region
        console.log("Linking Razorpay to Region...")
        await remoteLink.create([
            {
                [Modules.REGION]: { region_id: regionId },
                [Modules.PAYMENT]: { payment_provider_id: "razorpay" }
            }
        ])
        console.log("Razorpay linked.")

        console.log("--- MASTER FIX COMPLETED ---")

        // Verification
        const verification = await remoteQuery({
            service_zone: {
                fields: ["id", "name"],
                geo_zones: {
                    fields: ["country_code"]
                }
            },
            region: {
                fields: ["id", "name"],
                payment_providers: {
                    fields: ["id"]
                }
            }
        })
        console.log("VERIFICATION:", JSON.stringify(verification, null, 2))

    } catch (e) {
        console.error("MASTER FIX FAILED:", e.message)
        console.error(e.stack)
    }
}
