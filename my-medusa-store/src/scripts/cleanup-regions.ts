
import { MedusaContainer } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { updateRegionsWorkflow } from "@medusajs/core-flows"

export default async function fixAllRegions({ container }: { container: MedusaContainer }) {
    const regionModuleService = container.resolve(Modules.REGION)

    try {
        const regions = await regionModuleService.listRegions({}, { relations: ["countries"] })
        console.log("TOTAL REGIONS FOUND:", regions.length)

        for (const region of regions) {
            console.log(`Checking region: ${region.name} (${region.id})`)
            const hasIn = region.countries?.some(c => c.iso_2 === "in")

            if (!hasIn && (region.name === "India" || regions.length === 1)) {
                console.log(`Adding 'in' to region: ${region.name}`)
                await updateRegionsWorkflow(container).run({
                    input: {
                        selector: { id: region.id },
                        update: {
                            countries: ["in"]
                        }
                    }
                })
            }
        }

        console.log("Cleanup complete.")
    } catch (e) {
        console.error("Cleanup failed:", e.message)
    }
}
