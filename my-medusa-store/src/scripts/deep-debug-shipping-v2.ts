
import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function deepDebugShippingV2({ container }: { container: MedusaContainer }) {
    const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

    console.log("--- DEEP DEBUGGING MISSING SHIPPING V2 ---")

    try {
        // 1. Check Service Zones and their Geo Zones (Countries)
        console.log("\n1. SERVICE ZONES -> GEO ZONES:")
        const serviceZones = await remoteQuery({
            service_zone: {
                fields: ["id", "name"],
                geo_zones: {
                    fields: ["id", "type", "country_code", "province_code", "city"]
                }
            }
        })
        console.log(JSON.stringify(serviceZones, null, 2))

        // 2. Check Sales Channel -> Location -> Fulfillment Set links
        console.log("\n2. SALES CHANNEL -> LOCATION -> FULFILLMENT SET:")
        const scLinks = await remoteQuery({
            sales_channel: {
                fields: ["id", "name"],
                stock_locations: {
                    fields: ["id", "name"],
                    fulfillment_set_link: { // Alias from location-fulfillment-set definition
                        fulfillment_set: {
                            fields: ["id", "name"]
                        }
                    }
                }
            }
        })
        console.log(JSON.stringify(scLinks, null, 2))

        // 3. Check API Key to Sales Channel specifically
        console.log("\n3. API KEY -> SALES CHANNEL:")
        const apiKeys = await remoteQuery({
            api_key: {
                fields: ["id", "title", "token"],
                sales_channels: {
                    fields: ["id", "name"]
                }
            }
        })
        console.log(JSON.stringify(apiKeys, null, 2))

        // 4. Check Payment Providers for Region (To solve the empty array/razorpay issue)
        console.log("\n4. REGION -> PAYMENT PROVIDERS:")
        const regionPayments = await remoteQuery({
            region: {
                fields: ["id", "name"],
                payment_providers: {
                    fields: ["id"]
                }
            }
        })
        console.log(JSON.stringify(regionPayments, null, 2))

    } catch (e) {
        console.error("Deep debug failed:", e.message)
        console.error(e.stack)
    }
}
