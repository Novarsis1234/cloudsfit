
import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function inspectInfrastructure({ container }: { container: MedusaContainer }) {
    const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

    try {
        console.log("--- STOCK LOCATIONS ---")
        const locations = await remoteQuery({
            stock_location: {
                fields: ["id", "name"],
                fulfillment_sets: {
                    fields: ["id", "name"]
                },
                sales_channels: {
                    fields: ["id", "name"]
                }
            }
        })
        console.log(JSON.stringify(locations, null, 2))

        console.log("--- SALES CHANNELS ---")
        const channels = await remoteQuery({
            sales_channel: {
                fields: ["id", "name"],
                stock_locations: {
                    fields: ["id", "name"]
                }
            }
        })
        console.log(JSON.stringify(channels, null, 2))

        console.log("--- REGIONS ---")
        const regions = await remoteQuery({
            region: {
                fields: ["id", "name"],
                payment_providers: {
                    fields: ["id"]
                }
            }
        })
        console.log(JSON.stringify(regions, null, 2))

    } catch (e) {
        console.error("Infrastructure inspection failed:", e.message)
        console.error(e.stack)
    }
}
