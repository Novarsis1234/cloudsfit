
import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { Modules } from "@medusajs/framework/utils"

export default async function checkRegionProviders({ container }: { container: MedusaContainer }) {
    const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

    try {
        console.log("--- REGIONS WITH PROVIDERS ---")
        const regions = await remoteQuery({
            region: {
                fields: ["id", "name"],
                fulfillment_providers: {
                    fields: ["id"]
                }
            }
        })
        console.log(JSON.stringify(regions, null, 2))

        console.log("--- ALL FULFILLMENT PROVIDERS ---")
        const providers = await remoteQuery({
            fulfillment_provider: {
                fields: ["id"]
            }
        })
        console.log(JSON.stringify(providers, null, 2))

    } catch (e) {
        console.error("Inspection failed:", e.message)
    }
}
