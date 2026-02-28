
import { MedusaContainer } from "@medusajs/framework/types"

export default async function listPaymentProviders({ container }: { container: MedusaContainer }) {
    const paymentModuleService = container.resolve("payment")
    // @ts-ignore
    const providers = await paymentModuleService.listPaymentProviders({}, { skip: 0, take: 100 })

    console.log("--- REGISTERED PAYMENT PROVIDERS ---")
    console.log(JSON.stringify(providers, null, 2))
}
