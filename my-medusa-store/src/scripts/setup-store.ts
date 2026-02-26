
import {
    createRegionsWorkflow,
    createStockLocationsWorkflow,
    createProductsWorkflow,
    linkSalesChannelsToStockLocationWorkflow
} from "@medusajs/core-flows"
import { MedusaContainer } from "@medusajs/types"

import * as fs from 'fs'

export default async function setupStore({ container }: { container: MedusaContainer }) {
    const log = (msg: string) => {
        console.log(msg)
        fs.appendFileSync('setup_debug.log', msg + '\n')
    }

    if (fs.existsSync('setup_debug.log')) fs.unlinkSync('setup_debug.log')

    log("Starting store setup...")



    const remoteQuery = container.resolve("remoteQuery")

    // 1. Get or Create Region
    log("Checking Regions...")
    let region;
    try {
        const existingRegions = await remoteQuery({
            entryPoint: "region",
            fields: ["id", "name", "currency_code"],
        })
        region = existingRegions.find(r => r.name === "India" || r.currency_code === "inr")
    } catch (e) {
        log(`Error querying regions: ${e.message}`)
    }

    if (!region) {
        log("Creating Region...")
        try {
            const { result: newRegions } = await createRegionsWorkflow(container).run({
                input: {
                    regions: [{ name: "India", currency_code: "inr", countries: ["in"] }]
                }
            })
            region = newRegions[0]
            log(`Created Region: ${region.name} (${region.id})`)
        } catch (e) {
            log(`FAILED TO CREATE REGION: ${e.message || e}`)
        }
    } else {
        log(`Using existing Region: ${region.name} (${region.id})`)
    }

    // 2. Get or Create Stock Location
    log("Checking Stock Locations...")
    let location;
    try {
        const existingLocations = await remoteQuery({
            entryPoint: "stock_location",
            fields: ["id", "name"],
        })
        location = existingLocations.find(l => l.name === "Main Warehouse")
    } catch (e) {
        log(`Error querying locations: ${e.message}`)
    }

    if (!location) {
        log("Creating Stock Location...")
        try {
            const { result: newLocations } = await createStockLocationsWorkflow(container).run({
                input: {
                    locations: [{
                        name: "Main Warehouse",
                        address: { address_1: "Main St", city: "Mumbai", country_code: "in" }
                    }]
                }
            })
            location = newLocations[0]
            log(`Created Stock Location: ${location.name} (${location.id})`)
        } catch (e) {
            log(`FAILED TO CREATE STOCK LOCATION: ${e.message || e}`)
        }
    } else {
        log(`Using existing Stock Location: ${location.name} (${location.id})`)
    }

    // 3. Link Sales Channel to Stock Location
    if (location) {
        log("Linking Sales Channel to Stock Location...")
        try {
            const salesChannels = await remoteQuery({
                entryPoint: "sales_channel",
                fields: ["id", "name"],
            })
            const defaultChannel = salesChannels.find(sc => sc.name.toLowerCase().includes("default")) || salesChannels[0]

            if (defaultChannel) {
                await linkSalesChannelsToStockLocationWorkflow(container).run({
                    input: { id: location.id, add: [defaultChannel.id] }
                })
                log(`Linked Sales Channel: ${defaultChannel.name} to Stock Location`)
            }
        } catch (e) {
            log(`FAILED TO LINK SALES CHANNEL: ${e.message || e}`)
        }
    }

    // 4. Create Sample Product
    if (location && region) {
        log("Creating Sample Product...")
        try {
            await createProductsWorkflow(container).run({
                input: {
                    products: [
                        {
                            title: "Premium CloudsFit T-Shirt",
                            description: "High-quality, futuristic fashion for the modern athlete.",
                            handle: `premium-cloudsfit-tshirt-${Date.now()}`,
                            status: "published",
                            thumbnail: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-1.png",
                            options: [
                                { title: "Size", values: ["S", "M", "L", "XL"] },
                                { title: "Color", values: ["Black", "White"] }
                            ],
                            variants: [
                                {
                                    title: "Black / M",
                                    options: { Size: "M", Color: "Black" },
                                    sku: `CF-TSHIRT-BLK-M-${Date.now()}`,
                                    manage_inventory: true,
                                    prices: [
                                        { currency_code: "inr", amount: 1299 }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            })
            log("Created Sample Product with Prices.")
        } catch (e) {
            log(`FAILED TO CREATE PRODUCT: ${e.message || e}`)
        }
    }

    log("Setup Complete!")
}
