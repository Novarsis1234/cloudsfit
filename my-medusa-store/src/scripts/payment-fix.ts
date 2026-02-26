
import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function paymentFix({ container }: { container: MedusaContainer }) {
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
    const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

    console.log("Starting PAYMENT FIX...")

    try {
        const regionId = "reg_01KHX3RT0CD1REK0GABBPY8S2W" // India
        const badProviderId = "razorpay"
        const correctProviderId = "pp_razorpay_razorpay"

        // 1. Dismiss bad link
        console.log(`Dismissing bad link: ${badProviderId}...`)
        await remoteLink.dismiss([
            {
                [Modules.REGION]: { region_id: regionId },
                [Modules.PAYMENT]: { payment_provider_id: badProviderId }
            }
        ])
        console.log("Bad link dismissed.")

        // 2. Create correct link
        console.log(`Creating correct link: ${correctProviderId}...`)
        await remoteLink.create([
            {
                [Modules.REGION]: { region_id: regionId },
                [Modules.PAYMENT]: { payment_provider_id: correctProviderId }
            }
        ])
        console.log("Correct link created.")

        console.log("--- PAYMENT FIX COMPLETED ---")

        // Verification
        const verification = await remoteQuery({
            region: {
                fields: ["id", "name"],
                payment_providers: {
                    fields: ["id"]
                }
            }
        })
        console.log("VERIFICATION:", JSON.stringify(verification, null, 2))

    } catch (e) {
        console.error("PAYMENT FIX FAILED:", e.message)
        console.error(e.stack)
    }
}
