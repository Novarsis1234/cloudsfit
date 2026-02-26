
import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function superFix({ container }: { container: MedusaContainer }) {
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)
    const regionModuleService = container.resolve(Modules.REGION)
    const apiKeyModuleService = container.resolve(Modules.API_KEY)
    const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
    const pricingModuleService = container.resolve(Modules.PRICING)
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
    const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

    console.log("Starting SUPER FIX...")

    try {
        // 1. Data gathered from previous steps
        const regionId = "reg_01KHX3RT0CD1REK0GABBPY8S2W" // India
        const locationId = "sloc_01KHX3RT5462SAEMYBW48KYN1P" // Main Warehouse
        const fulfillmentSetId = "fs_92fmz" // Standard FS
        const serviceZoneId = "serzo_01KHZERCDM8C8JYRT7ES2DGQ01" // India Shipping Zone
        const profileId = "sp_01KHR89VV30KD5KYNXMQQN54CN" // Default Shipping Profile
        const salesChannelId = "sc_01KHR8AW04HPG3B2X67YKMMVV4" // Default Sales Channel
        const apiKeyToken = "pk_1fd48de7f62029167642428cc7a588e21e634e8f41b240f5b391bae65693a3a3"

        // 2. Link Stock Location to Fulfillment Set
        console.log("Linking Stock Location to Fulfillment Set...")
        await remoteLink.create([
            {
                [Modules.STOCK_LOCATION]: { stock_location_id: locationId },
                [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSetId }
            }
        ])

        // 3. Link Region to Fulfillment Provider 'manual'
        console.log("Linking Region to Fulfillment Provider...")
        await remoteLink.create([
            {
                [Modules.REGION]: { region_id: regionId },
                [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual" }
            }
        ])

        // 4. Create Shipping Option
        console.log("Creating Standard Shipping Option...")
        const shippingOption = await fulfillmentModuleService.createShippingOptions({
            name: "Standard Shipping",
            price_type: "flat",
            service_zone_id: serviceZoneId,
            shipping_profile_id: profileId,
            provider_id: "manual",
            type: {
                label: "Standard",
                description: "Standard shipping for India",
                code: "standard"
            }
        })
        console.log(`Shipping Option Created: ${shippingOption.id}`)

        // 5. Create Price Set for Shipping Option
        console.log("Creating Price Set for Shipping Option...")
        const priceSet = await pricingModuleService.createPriceSets({
            prices: [
                {
                    amount: 0,
                    currency_code: "inr",
                    rules: {
                        region_id: regionId
                    }
                }
            ]
        })

        // Link Shipping Option to Price Set
        await remoteLink.create([
            {
                [Modules.FULFILLMENT]: { shipping_option_id: shippingOption.id },
                [Modules.PRICING]: { price_set_id: priceSet.id }
            }
        ])

        // 6. Link API Key to Sales Channel
        console.log("Linking API Key to Sales Channel...")
        const apiKeys = await apiKeyModuleService.listApiKeys({ token: apiKeyToken })
        if (apiKeys.length > 0) {
            await remoteLink.create([
                {
                    [Modules.API_KEY]: { api_key_id: apiKeys[0].id },
                    [Modules.SALES_CHANNEL]: { sales_channel_id: salesChannelId }
                }
            ])
            console.log("API Key linked to Sales Channel.")
        }

        console.log("--- SUPER FIX COMPLETED SUCCESSFULLY ---")

        // Verification Query
        const finalCheck = await remoteQuery({
            region: {
                fields: ["id", "name"],
                fulfillment_providers: {
                    fields: ["id"]
                },
                fulfillment_sets: {
                    fields: ["id", "name"],
                    service_zones: {
                        fields: ["id", "name"],
                        shipping_options: {
                            fields: ["id", "name"]
                        }
                    }
                }
            }
        })
        console.log("FINAL VERIFICATION:", JSON.stringify(finalCheck, null, 2))

    } catch (e) {
        console.error("SUPER FIX FAILED:", e.message)
        console.error(e.stack)
    }
}
