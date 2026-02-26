import { MedusaContainer } from "@medusajs/types"
import { createProductsWorkflow } from "@medusajs/core-flows"

export default async function seedDynamicData({ container }: { container: MedusaContainer }) {
    console.log("Starting dynamic data seed...")

    await createProductsWorkflow(container).run({
        input: {
            products: [
                {
                    title: "Formal Shirt",
                    description: "Sharp and sophisticated formal shirt for professional excellence.",
                    handle: "formal-shirt",
                    status: "published",
                    options: [
                        { title: "Color", values: ["White", "Light Blue", "Navy"] },
                        { title: "Size", values: ["38", "40", "42", "44"] }
                    ],
                    variants: [
                        {
                            title: "White / 40",
                            options: { Color: "White", Size: "40" },
                            prices: [{ currency_code: "inr", amount: 1599 }],
                            manage_inventory: true,
                            inventory_quantity: 40
                        },
                        {
                            title: "Navy / 42",
                            options: { Color: "Navy", Size: "42" },
                            prices: [{ currency_code: "inr", amount: 1699 }],
                            manage_inventory: true,
                            inventory_quantity: 35
                        }
                    ]
                },
                {
                    title: "Urban Hoodie",
                    description: "Ultra-soft fleece hoodie with modern street-style aesthetics.",
                    handle: "urban-hoodie",
                    status: "published",
                    options: [
                        { title: "Color", values: ["Gray", "Black", "Maroon"] },
                        { title: "Size", values: ["S", "M", "L", "XL"] }
                    ],
                    variants: [
                        {
                            title: "Gray / M",
                            options: { Color: "Gray", Size: "M" },
                            prices: [{ currency_code: "inr", amount: 1899 }],
                            manage_inventory: true,
                            inventory_quantity: 25
                        },
                        {
                            title: "Black / L",
                            options: { Color: "Black", Size: "L" },
                            prices: [{ currency_code: "inr", amount: 1899 }],
                            manage_inventory: true,
                            inventory_quantity: 30
                        }
                    ]
                }
            ]
        }
    })

    console.log("Successfully seeded dynamic products with Color and Size options.")
}
