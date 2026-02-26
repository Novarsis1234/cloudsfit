
import { MedusaContainer } from "@medusajs/framework/types"

export default async function inspectProviders({ container }: { container: MedusaContainer }) {
    const fulfillmentModuleService = container.resolve("fulfillment")

    try {
        const providers = await fulfillmentModuleService.listFulfillmentProviders()
        console.log("FULFILLMENT PROVIDERS:", JSON.stringify(providers, null, 2))
    } catch (e) {
        console.error("Error listing providers:", e.message)
    }
}
