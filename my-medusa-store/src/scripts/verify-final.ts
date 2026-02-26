
import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function verifyFinal({ container }: { container: MedusaContainer }) {
    const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

    try {
        console.log("--- FINAL CHECK: SHIPPING OPTIONS ---")
        const options = await remoteQuery({
            shipping_option: {
                fields: ["id", "name", "price_type"],
                service_zone: {
                    fields: ["id", "name"]
                }
            }
        })
        console.log(JSON.stringify(options, null, 2))

        console.log("--- FINAL CHECK: API KEY LINKS ---")
        const keys = await remoteQuery({
            api_key: {
                fields: ["id", "title"],
                sales_channels: {
                    fields: ["id", "name"]
                }
            }
        })
        console.log(JSON.stringify(keys, null, 2))

    } catch (e) {
        console.error("Verification failed:", e.message)
    }
}
