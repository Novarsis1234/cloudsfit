
import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function checkPaymentProviders({ container }: { container: MedusaContainer }) {
    const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

    console.log("--- CHECKING PAYMENT PROVIDERS ---")

    try {
        const regionId = "reg_01KHX3RT0CD1REK0GABBPY8S2W" // India

        const query = {
            region: {
                fields: ["id", "name"],
                payment_providers: {
                    fields: ["id", "is_enabled"]
                }
            }
        }

        const result = await remoteQuery(query)
        console.log(JSON.stringify(result, null, 2))

        // Also list all providers from the payment module
        const paymentModule = container.resolve(Modules.PAYMENT)
        const providers = await paymentModule.listPaymentProviders({})
        console.log("\n--- ALL PAYMENT PROVIDERS ---")
        console.log(JSON.stringify(providers, null, 2))

    } catch (e) {
        console.error("Check failed:", e.message)
        console.error(e.stack)
    }
}
