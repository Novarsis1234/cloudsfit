
import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function queryFulfillment({ container }: { container: MedusaContainer }) {
    const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

    try {
        const query = {
            fulfillment_set: {
                fields: ["id", "name", "type"],
                service_zones: {
                    fields: ["id", "name"],
                    shipping_options: {
                        fields: ["id", "name", "price_type"]
                    }
                }
            }
        }
        const fs = await remoteQuery(query)
        console.log("REMOTE QUERY FS:", JSON.stringify(fs, null, 2))

        const optQuery = {
            shipping_option: {
                fields: ["id", "name", "price_type"],
                service_zone: {
                    fields: ["id", "name"]
                }
            }
        }
        const options = await remoteQuery(optQuery)
        console.log("REMOTE QUERY OPTIONS:", JSON.stringify(options, null, 2))
    } catch (e) {
        console.error("Query failed:", e.message)
    }
}
