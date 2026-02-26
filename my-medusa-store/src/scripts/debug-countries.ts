
import { MedusaContainer } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { updateRegionsWorkflow } from "@medusajs/core-flows"

export default async function debugCountries({ container }: { container: MedusaContainer }) {
    const regionModuleService = container.resolve(Modules.REGION)

    try {
        // 1. List all countries to see what's available
        const countries = await regionModuleService.listCountries({}, { take: 300 })
        console.log("AVAILABLE COUNTRIES SAMPLE:", countries.slice(0, 10).map(c => c.iso_2))

        const indiaCountry = countries.find(c => c.iso_2 === "in")
        console.log("INDIA COUNTRY FOUND:", !!indiaCountry)

        // 2. Find India Region
        const regions = await regionModuleService.listRegions({ name: "India" })
        if (regions.length === 0) return
        const region = regions[0]

        // 3. Use Workflow to update region (this is more robust)
        console.log("Updating region via workflow...")
        await updateRegionsWorkflow(container).run({
            input: {
                selector: { id: region.id },
                update: {
                    countries: ["in"]
                }
            }
        })

        console.log("SUCCESS: Attempted workflow update.")

        // 4. Verify again
        const verification = await regionModuleService.listRegions({ id: region.id }, { relations: ["countries"] })
        console.log("VERIFICATION:", JSON.stringify(verification, null, 2))
    } catch (e) {
        console.error("Debug failed:", e.message)
        console.error(e.stack)
    }
}
