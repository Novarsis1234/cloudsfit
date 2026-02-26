
import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function inspectLinks({ container }: { container: MedusaContainer }) {
    const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

    try {
        console.log("--- SALES CHANNELS ---")
        const salesChannels = await remoteQuery({
            sales_channel: {
                fields: ["id", "name", "description"]
            }
        })
        console.log(JSON.stringify(salesChannels, null, 2))

        console.log("--- PUBLISHABLE KEYS ---")
        const keys = await remoteQuery({
            api_key: {
                fields: ["id", "title", "token", "type"],
                sales_channels: {
                    fields: ["id", "name"]
                }
            }
        })
        console.log(JSON.stringify(keys, null, 2))

        console.log("--- REGIONS ---")
        const regions = await remoteQuery({
            region: {
                fields: ["id", "name"],
                countries: {
                    fields: ["iso_2"]
                }
            }
        })
        console.log(JSON.stringify(regions, null, 2))

    } catch (e) {
        console.error("Link inspection failed:", e.message)
    }
}
