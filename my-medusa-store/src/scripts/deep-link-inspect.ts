
import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function deepLinkInspect({ container }: { container: MedusaContainer }) {
    const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

    try {
        console.log("--- ALL FULFILLMENT SETS ---")
        const fsData = await remoteQuery({
            fulfillment_set: {
                fields: ["id", "name", "type"]
            }
        })
        console.log(JSON.stringify(fsData, null, 2))

        console.log("--- ALL SHIPPING OPTIONS ---")
        const soData = await remoteQuery({
            shipping_option: {
                fields: ["id", "name", "price_type", "service_zone_id"],
                service_zone: {
                    fields: ["id", "name"]
                }
            }
        })
        console.log(JSON.stringify(soData, null, 2))

        console.log("--- REGIONS WITH LINKS ---")
        const regionData = await remoteQuery({
            region: {
                fields: ["id", "name"],
                fulfillment_sets: {
                    fields: ["id", "name"]
                }
            }
        })
        console.log(JSON.stringify(regionData, null, 2))

        console.log("--- SALES CHANNELS ---")
        const scData = await remoteQuery({
            sales_channel: {
                fields: ["id", "name"]
            }
        })
        console.log(JSON.stringify(scData, null, 2))

    } catch (e) {
        console.error("Deep inspection failed:", e.message)
        console.error(e.stack)
    }
}
