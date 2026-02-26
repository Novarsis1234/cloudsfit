import { MedusaContainer } from "@medusajs/types"
import { IProductModuleService, IPricingModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"

const DEFAULT_PRICE_INR = 999

export default async function addInrPrices({ container }: { container: MedusaContainer }) {
    const productModule: IProductModuleService = container.resolve(ModuleRegistrationName.PRODUCT)
    const pricingModule: IPricingModuleService = container.resolve(ModuleRegistrationName.PRICING)
    const remoteLink = container.resolve("remoteLink") as any

    console.log("Fetching products...")
    const [products] = await productModule.listAndCountProducts({}, { select: ["id", "title"] })

    console.log(`Found ${products.length} products. Checking variants...`)

    for (const product of products) {
        const [variants] = await productModule.listAndCountProductVariants({ product_id: product.id }, { select: ["id", "title"] })

        for (const variant of variants) {
            // Check if variant has a price set linked
            const links = await remoteLink.list({
                [ModuleRegistrationName.PRODUCT]: { variant_id: variant.id },
                [ModuleRegistrationName.PRICING]: { price_set_id: "*" }
            }).catch(() => [])

            if (links.length === 0) {
                console.log(`\nProduct: ${product.title} | Variant: ${variant.title} (ID: ${variant.id})`)
                console.log(`  -> No price set found. Creating one with INR ${DEFAULT_PRICE_INR}...`)

                try {
                    const priceSet = await pricingModule.createPriceSets([
                        {
                            prices: [{ currency_code: "inr", amount: DEFAULT_PRICE_INR }]
                        }
                    ])

                    await remoteLink.create([
                        {
                            [ModuleRegistrationName.PRODUCT]: { variant_id: variant.id },
                            [ModuleRegistrationName.PRICING]: { price_set_id: priceSet[0].id },
                        }
                    ])
                    console.log(`  ✓ Price set created and linked: ${priceSet[0].id}`)
                } catch (err: any) {
                    console.error(`  ✗ Failed to create price set:`, err.message || err)
                }
            } else {
                console.log(`Product: ${product.title} | Variant: ${variant.title} -> Already linked ✓`)
                // Optional: Ensure it has an INR price inside that price set
                // But for now, linking is the main issue.
            }
        }
    }

    console.log("\n✅ Done!")
}
