
import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function deepDebugShipping({ container }: { container: MedusaContainer }) {
    const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

    console.log("--- DEEP DEBUGGING MISSING SHIPPING ---")

    try {
        // 1. Check Shipping Options and their Prices
        console.log("\n1. SHIPPING OPTIONS DEEP DIVE:")
        const options = await remoteQuery({
            shipping_option: {
                fields: ["id", "name", "price_type", "provider_id", "service_zone_id"],
                price_set_link: {
                    price_set: {
                        fields: ["id"],
                        prices: {
                            fields: ["id", "amount", "currency_code"],
                        }
                    }
                },
                service_zone: {
                    fields: ["id", "name"],
                    fulfillment_set: {
                        fields: ["id", "name"]
                    }
                }
            }
        })
        console.log(JSON.stringify(options, null, 2))

        // 2. Check Regions
        console.log("\n2. REGIONS:")
        const regions = await remoteQuery({
            region: {
                fields: ["id", "name", "currency_code"],
                countries: {
                    fields: ["display_name", "iso_2"]
                }
            }
        })
        console.log(JSON.stringify(regions, null, 2))

        // 3. Check Products
        console.log("\n3. PRODUCTS:")
        const products = await remoteQuery({
            product: {
                fields: ["id", "title"],
                shipping_profile: {
                    fields: ["id", "name"]
                }
            }
        })
        console.log(JSON.stringify(products, null, 2))

        // 4. Check Sales Channels -> API Keys
        console.log("\n4. SALES CHANNELS -> API KEYS:")
        const salesChannels = await remoteQuery({
            sales_channel: {
                fields: ["id", "name"],
                api_keys: {
                    fields: ["id", "title", "token"]
                }
            }
        })
        console.log(JSON.stringify(salesChannels, null, 2))

        // 5. Check Fulfillment Set -> Location links
        console.log("\n5. FULFILLMENT SETS -> LOCATIONS:")
        const fulfillmentSets = await remoteQuery({
            fulfillment_set: {
                fields: ["id", "name"],
                locations: {
                    fields: ["id", "name"]
                }
            }
        })
        console.log(JSON.stringify(fulfillmentSets, null, 2))

    } catch (e) {
        console.error("Deep debug failed:", e.message)
        console.error(e.stack)
    }
}
