
import { MedusaContainer } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function fixShipping({ container }: { container: MedusaContainer }) {
    const regionModuleService = container.resolve(Modules.REGION)
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)

    console.log("Starting shipping fix script...")

    // 1. Ensure India Region exists
    let regionId: string
    try {
        let regions = await regionModuleService.listRegions({})
        let region = regions.find((r: any) => r.name === "India")

        if (!region) {
            console.log("Creating India region...")
            region = await regionModuleService.createRegions({
                name: "India",
                currency_code: "inr",
                countries: ["in"]
            })
            regionId = region.id
            console.log("Created India region:", regionId)
        } else {
            regionId = region.id
            console.log("India region already exists:", regionId)
        }
    } catch (e) {
        console.error("Error with region step:", e.message)
        return
    }

    // 2. Get or Create Fulfillment Set
    let fulfillmentSet: any
    try {
        let fulfillmentSets = await fulfillmentModuleService.listFulfillmentSets({})
        if (fulfillmentSets.length === 0) {
            console.log("Creating default fulfillment set for manual provider...")
            fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
                name: "Default Fulfillment Set",
                type: "manual",
            })
            console.log("Created fulfillment set:", fulfillmentSet.id)
        } else {
            fulfillmentSet = fulfillmentSets[0]
            console.log("Using existing fulfillment set:", fulfillmentSet.id)
        }
    } catch (e) {
        console.error("Error with fulfillment set step:", e.message)
        return
    }

    // 3. Get or Create Shipping Profile
    let shippingProfileId: string
    try {
        const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({})
        let sp = shippingProfiles.find((p: any) => p.name === "Default")
        if (!sp) {
            if (shippingProfiles.length === 0) {
                console.log("Creating default shipping profile...")
                sp = await fulfillmentModuleService.createShippingProfiles({ name: "Default", type: "default" })
                shippingProfileId = sp.id
            } else {
                shippingProfileId = shippingProfiles[0].id
            }
        } else {
            shippingProfileId = sp.id
        }
        console.log("Using shipping profile:", shippingProfileId)
    } catch (e) {
        console.error("Error with shipping profile step:", e.message)
        return
    }

    // 4. Ensure Shipping Zone exists
    let zoneId: string
    try {
        // In Medusa 2.0, service zones are children of fulfillment sets
        const zones = await fulfillmentModuleService.listServiceZones({ fulfillment_set: { id: fulfillmentSet.id } })
        let zone = zones.find((z: any) => z.name === "India Shipping Zone")

        if (!zone) {
            console.log("Creating India shipping zone...")
            zone = await fulfillmentModuleService.createServiceZones({
                fulfillment_set_id: fulfillmentSet.id,
                name: "India Shipping Zone",
                geo_areas: [
                    {
                        type: "country",
                        country_code: "in"
                    }
                ]
            })
            zoneId = zone.id
            console.log("Created India shipping zone:", zoneId)
        } else {
            zoneId = zone.id
            console.log("India shipping zone already exists:", zoneId)
        }
    } catch (e) {
        console.error("Error with shipping zone step:", e.message)
        return
    }

    // 5. Ensure Shipping Option exists
    try {
        const options = await fulfillmentModuleService.listShippingOptions({ name: "Standard Shipping" })
        if (options.length === 0) {
            console.log("Creating Standard Shipping option...")
            const option = await fulfillmentModuleService.createShippingOptions({
                name: "Standard Shipping",
                price_type: "flat",
                service_zone_id: zoneId,
                shipping_profile_id: shippingProfileId,
                provider_id: "manual",
                type: {
                    label: "Standard",
                    description: "Standard Delivery",
                    code: "standard"
                },
                rules: []
            })
            console.log("Created Standard Shipping option:", option.id)
        } else {
            console.log("Standard Shipping option already exists.")
        }
    } catch (e) {
        console.error("Error with shipping option step:", e.message)
    }
}
