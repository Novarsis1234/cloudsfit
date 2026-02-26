
import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function queryFulfillmentLinks({ container }: { container: MedusaContainer }) {
    const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

    console.log("Querying Regions with Fulfillment Sets and Shipping Options...")

    const query = {
        region: {
            fields: ["id", "name", "currency_code"],
            countries: {
                fields: ["iso_2"]
            },
            fulfillment_sets: {
                fields: ["id", "name", "type"],
                service_zones: {
                    fields: ["id", "name"],
                    shipping_options: {
                        fields: ["id", "name", "price_type"],
                        shipping_profile: {
                            fields: ["id", "name"]
                        },
                        provider: {
                            fields: ["id"]
                        }
                    }
                }
            }
        }
    }

    try {
        const regions = await remoteQuery(query)
        console.log("FULL CONFIGURATION:", JSON.stringify(regions, null, 2))
    } catch (e) {
        console.error("Query failed:", e.message)

        // Fallback: simpler query if above fails
        console.log("Attempting simpler query...")
        try {
            const simpleQuery = {
                fulfillment_set: {
                    fields: ["id", "name"],
                    service_zones: {
                        fields: ["id", "name"],
                        shipping_options: {
                            fields: ["id", "name"]
                        }
                    }
                }
            }
            const data = await remoteQuery(simpleQuery)
            console.log("SIMPLE FULFILLMENT DATA:", JSON.stringify(data, null, 2))
        } catch (e2) {
            console.error("Simple query also failed:", e2.message)
        }
    }
}
