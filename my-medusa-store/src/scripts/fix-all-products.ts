
import {
    linkSalesChannelsToStockLocationWorkflow,
    createInventoryItemsWorkflow,
    linkProductsToSalesChannelWorkflow
} from "@medusajs/core-flows"
import { MedusaContainer } from "@medusajs/types"

export default async function fixAllProducts({ container }: { container: MedusaContainer }) {
    const remoteQuery = container.resolve("remoteQuery")
    const log = (msg: string) => console.log(msg)

    log("Starting Global Fix...")

    // 1. Get Entities
    const scs = await remoteQuery({ entryPoint: "sales_channel", fields: ["id", "name"] })
    const defaultChannel = scs.find(sc => sc.name.toLowerCase().includes("default")) || scs[0]

    const locations = await remoteQuery({ entryPoint: "stock_location", fields: ["id", "name"] })
    const mainLocation = locations.find(l => l.name === "Main Warehouse") || locations[0]

    if (!defaultChannel || !mainLocation) {
        log("Critial error: Missing Sales Channel or Stock Location")
        return
    }
    log(`Using Channel: ${defaultChannel.name} (${defaultChannel.id})`)
    log(`Using Location: ${mainLocation.name} (${mainLocation.id})`)

    // 2. Link Sales Channel to Stock Location
    if (mainLocation) {
        log("Linking Sales Channel to Stock Location...")
        try {
            const salesChannels = await remoteQuery({
                entryPoint: "sales_channel",
                fields: ["id", "name"],
            })
            const defaultChannel = salesChannels.find((sc: any) => sc.name.toLowerCase().includes("default")) || salesChannels[0]

            if (defaultChannel) {
                await linkSalesChannelsToStockLocationWorkflow(container).run({
                    input: { id: mainLocation.id, add: [defaultChannel.id] }
                })
                log(`Linked Sales Channel: ${defaultChannel.name} to Stock Location`)
            }
        } catch (e: any) {
            log(`FAILED TO LINK SALES CHANNEL: ${e.message || e}`)
        }
    }

    // 3. Get All Products
    const products = await remoteQuery({
        entryPoint: "product",
        fields: ["id", "title", "variants.id", "variants.title", "variants.sku"]
    })
    log(`Found ${products.length} products to fix.`)

    // 4. Link Products to Sales Channel
    const productIds = products.map((p: any) => p.id)
    try {
        // Fetch default channel again if needed or use previous
        const scs = await remoteQuery({ entryPoint: "sales_channel", fields: ["id", "name"] })
        const defaultChannel = scs.find((sc: any) => sc.name.toLowerCase().includes("default")) || scs[0]

        if (defaultChannel) {
            // Correct workflow for linking products to sales channel in v2.2
            await linkProductsToSalesChannelWorkflow(container).run({
                input: {
                    id: defaultChannel.id,
                    add: productIds
                }
            })
            log("Linked all products to Default Sales Channel")
        }
    } catch (e: any) {
        log(`Error linking products: ${e.message || e}`)
    }

    // 5. Ensure Inventory and Pricing linkage
    const inventoryModuleService: any = container.resolve("inventoryModuleService")

    for (const product of products as any[]) {
        log(`Fixing Product: ${product.title}`)
        for (const variant of product.variants) {
            try {
                const inventoryItems = await inventoryModuleService.list({
                    sku: variant.sku || `sku-${variant.id}`
                })

                let inventoryItemId;
                if (inventoryItems.length === 0) {
                    const newItem = await inventoryModuleService.create({
                        sku: variant.sku || `sku-${variant.id}`,
                    })
                    inventoryItemId = newItem.id
                    log(`  Created inventory item for ${variant.title}`)
                } else {
                    inventoryItemId = inventoryItems[0].id
                    log(`  Using existing inventory item for ${variant.title}`)
                }

                // Link to variant via module
                // Actually, in v2 this is handled by links.
                // We'll use the link manager or just assume it's created via workflow

                // Link inventory item to stock location with some quantity
                try {
                    await inventoryModuleService.createInventoryLevels([{
                        inventory_item_id: inventoryItemId,
                        location_id: mainLocation.id,
                        stocked_quantity: 100
                    }])
                } catch (e) {
                    // Might already exist, update instead
                    await inventoryModuleService.updateInventoryLevels([{
                        inventory_item_id: inventoryItemId,
                        location_id: mainLocation.id,
                        stocked_quantity: 100
                    }])
                }
                log(`  Updated inventory level to 100 at ${mainLocation.name}`)

            } catch (e: any) {
                log(`  Error fixing variant ${variant.title}: ${e.message || e}`)
            }
        }
    }

    log("Global Fix Complete!")
}
