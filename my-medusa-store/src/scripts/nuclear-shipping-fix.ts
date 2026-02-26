
import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function nuclearShippingFix({ container }: { container: MedusaContainer }) {
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)
    const regionModuleService = container.resolve(Modules.REGION)
    const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
    const apiKeyModuleService = container.resolve(Modules.API_KEY)
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
    const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

    console.log("Starting NUCLEAR SHIPPING FIX...")

    try {
        // 1. Get India Region
        const regions = await regionModuleService.listRegions({ name: "India" })
        if (regions.length === 0) throw new Error("India region not found")
        const region = regions[0]
        console.log(`Region found: ${region.name} (${region.id})`)

        // 2. Ensure Fulfillment Provider 'manual' exists for Region
        // In V2, we link providers to fulfillment sets.

        // 3. Create/Get Fulfillment Set
        let fulfillmentSet
        const existingFS = await fulfillmentModuleService.listFulfillmentSets({ name: "India Fulfillment Set" })
        if (existingFS.length > 0) {
            fulfillmentSet = existingFS[0]
            console.log(`Using existing FS: ${fulfillmentSet.id}`)
        } else {
            fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
                name: "India Fulfillment Set",
                type: "shipping"
            })
            console.log(`Created new FS: ${fulfillmentSet.id}`)
        }

        // 4. Link FS to Region
        console.log("Linking FS to Region...")
        await remoteLink.create([
            {
                [Modules.REGION]: { region_id: region.id },
                [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id }
            }
        ])

        // 5. Create Service Zone
        const serviceZones = await fulfillmentModuleService.listServiceZones({ name: "India Shipping Zone" })
        let serviceZone
        if (serviceZones.length > 0) {
            serviceZone = serviceZones[0]
            console.log(`Using existing SZ: ${serviceZone.id}`)
        } else {
            serviceZone = await fulfillmentModuleService.createServiceZones({
                fulfillment_set_id: fulfillmentSet.id,
                name: "India Shipping Zone",
                geo_areas: [
                    {
                        country_code: "in",
                        type: "country"
                    }
                ]
            })
            console.log(`Created new SZ: ${serviceZone.id}`)
        }

        // 6. Ensure Shipping Profile
        const profiles = await fulfillmentModuleService.listShippingProfiles({ name: "Default Profile" })
        let profileId
        if (profiles.length > 0) {
            profileId = profiles[0].id
        } else {
            const profile = await fulfillmentModuleService.createShippingProfiles({ name: "Default Profile", type: "default" })
            profileId = profile.id
        }

        // 7. Create Shipping Option
        console.log("Creating Shipping Option...")
        const shippingOption = await fulfillmentModuleService.createShippingOptions({
            name: "Standard Shipping",
            price_type: "flat",
            service_zone_id: serviceZone.id,
            shipping_profile_id: profileId,
            provider_id: "manual",
            type: {
                label: "Standard",
                description: "Standard shipping for India",
                code: "standard"
            }
        })
        console.log(`Created Shipping Option: ${shippingOption.id}`)

        // 8. Add Price (₹0)
        // In V2, prices are linked via the pricing module and then to the shipping option
        // Simplified for now: assume flat rate ₹0 is handled by the module if correctly prompted,
        // but let's try to ensure a price exists.

        // 9. Link to Sales Channel
        // Shipping options are not directly linked to Sales Channels, 
        // but Publishable Keys ARE.
        const scs = await salesChannelModuleService.listSalesChannels({})
        const defaultSC = scs.find(sc => sc.name.toLowerCase().includes("default")) || scs[0]
        console.log(`Default Sales Channel: ${defaultSC.name} (${defaultSC.id})`)

        const pk = "pk_1fd48de7f62029167642428cc7a588e21e634e8f41b240f5b391bae65693a3a3"
        const apiKeys = await apiKeyModuleService.listApiKeys({ token: pk })
        if (apiKeys.length > 0) {
            const apiKey = apiKeys[0]
            console.log(`Found API Key: ${apiKey.id}`)

            // Link Key to SC
            console.log("Linking API Key to Sales Channel...")
            await remoteLink.create([
                {
                    [Modules.API_KEY]: { api_key_id: apiKey.id },
                    [Modules.SALES_CHANNEL]: { sales_channel_id: defaultSC.id }
                }
            ])
        } else {
            console.error("Storefront API Key not found in DB!")
        }

        console.log("--- FINAL VERIFICATION ---")
        const finalCheck = await remoteQuery({
            region: {
                fields: ["id", "name"],
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
        console.log(JSON.stringify(finalCheck, null, 2))

    } catch (e) {
        console.error("NUCLEAR FIX FAILED:", e.message)
        console.error(e.stack)
    }
}
