import { MedusaContainer } from "@medusajs/types"
import { IProductModuleService, IPricingModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"

/**
 * This script adds INR prices to all product variants that have
 * no prices set. Run with:
 * 
 *   npx medusa exec src/scripts/add-inr-price.ts
 * 
 * You will be prompted for the price amount for each variant.
 * Or edit the DEFAULT_PRICE below to set all to one value.
 */

const DEFAULT_PRICE_INR = 999 // Set your default price in INR (in whole rupees, NOT paise)

export default async function addInrPrices({ container }: { container: MedusaContainer }) {
    const productModule: IProductModuleService = container.resolve(ModuleRegistrationName.PRODUCT)
    const pricingModule: IPricingModuleService = container.resolve(ModuleRegistrationName.PRICING)

    // Get all products with their variants
    const [products] = await productModule.listAndCountProducts(
        {},
        { relations: ["variants", "variants.prices"] }
    )

    console.log(`Found ${products.length} products`)

    for (const product of products) {
        for (const variant of product.variants || []) {
            const prices = (variant as any).prices || []
            const hasInrPrice = prices.some((p: any) => p.currency_code === "inr")

            if (!hasInrPrice) {
                console.log(`\nProduct: ${product.title} | Variant: ${variant.title} | ID: ${variant.id}`)
                console.log(`  -> Adding INR ${DEFAULT_PRICE_INR} price...`)

                try {
                    await pricingModule.createPriceSets([
                        {
                            prices: [
                                {
                                    currency_code: "inr",
                                    amount: DEFAULT_PRICE_INR,
                                },
                            ],
                        },
                    ])

                    // Link the price set to the variant
                    const pricingLink = container.resolve("remoteLink") as any
                    const priceSets = await pricingModule.listPriceSets({}, { order: { created_at: "DESC" }, take: 1 })
                    const latestPriceSet = priceSets[0]

                    await pricingLink.create([
                        {
                            [ModuleRegistrationName.PRODUCT]: { variant_id: variant.id },
                            [ModuleRegistrationName.PRICING]: { price_set_id: latestPriceSet.id },
                        },
                    ])

                    console.log(`  ✓ Price added successfully!`)
                } catch (err) {
                    console.error(`  ✗ Failed to add price:`, err)
                }
            } else {
                console.log(`Product: ${product.title} | Variant: ${variant.title} → already has INR price ✓`)
            }
        }
    }

    console.log("\n✅ Done! Restart your storefront to see updated prices.")
}
