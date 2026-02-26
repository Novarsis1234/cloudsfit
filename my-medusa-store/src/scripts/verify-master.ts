
import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function verifyMaster({ container }: { container: MedusaContainer }) {
    const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

    try {
        console.log("--- FINAL VERIFICATION ---")
        const data = await remoteQuery({
            service_zone: {
                fields: ["id", "name"],
                geo_zones: {
                    fields: ["country_code", "type"]
                }
            },
            region: {
                fields: ["id", "name"],
                payment_providers: {
                    fields: ["id"]
                }
            }
        })
        console.log(JSON.stringify(data, null, 2))
    } catch (e) {
        console.error("Verification failed:", e.message)
    }
}
