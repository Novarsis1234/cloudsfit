
import { MedusaContainer } from "@medusajs/types"
import { createProductsWorkflow } from "@medusajs/core-flows"

export default async function seedDemoData({ container }: { container: MedusaContainer }) {
  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Demo Product",
          description: "A simple demo product seeded for testing.",
          handle: "demo-product",
          status: "published",
          images: [
            { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-1.png" }
          ],
          options: [
            { title: "Size", values: ["One Size"] }
          ],
          variants: [
            {
              title: "Default Variant",
              options: { Size: "One Size" },
              prices: [
                { currency_code: "usd", amount: 1999 }
              ],
              manage_inventory: true,
              inventory_quantity: 100
            }
          ]
        }
      ]
    }
  })
  console.log("Seeded demo product.")
}





