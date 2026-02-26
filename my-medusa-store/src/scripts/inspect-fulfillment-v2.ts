
import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function inspectFulfillmentLinks({ container }: { container: MedusaContainer }) {
    const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

    try {
        console.log("--- FULFILLMENT SETS ---")
        const fulfillmentSets = await remoteQuery({
            fulfillment_set: {
                fields: ["id", "name", "type"],
                service_zones: {
                    fields: ["id", "name"],
                    shipping_options: {
                        fields: ["id", "name"]
                    }
                }
            }
        })
        console.log(JSON.stringify(fulfillmentSets, null, 2))

        console.log("--- REGIONS ---")
        const regions = await remoteQuery({
            region: {
                fields: ["id", "name"]
            }
        })
        console.log(JSON.stringify(regions, null, 2))

        // In Medusa 2.0, links are usually queried via the link name
        // Try to find links between regions and fulfillment sets
        // The link name is usually 'region_fulfillment_set'
        console.log("--- REGION FULFILLMENT SET LINKS ---")
        try {
            const links = await remoteQuery({
                region_fulfillment_set: {
                    fields: ["region_id", "fulfillment_set_id"]
                }
            })
            console.log(JSON.stringify(links, null, 2))
        } catch (e) {
            console.log("Could not query region_fulfillment_set directly:", e.message)
        }

    } catch (e) {
        console.error("Inspection failed:", e.message)
    }
}
