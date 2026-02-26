
import { MedusaContainer } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function listProviders({ container }: { container: MedusaContainer }) {
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)

    try {
        const providers = await fulfillmentModuleService.listFulfillmentProviders({})
        console.log("--- FULFILLMENT PROVIDERS ---")
        console.log(JSON.stringify(providers, null, 2))
    } catch (e) {
        console.error("Listing providers failed:", e.message)
        console.error(e.stack)
    }
}
