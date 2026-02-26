
import { MedusaContainer } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function inspectRegionDetails({ container }: { container: MedusaContainer }) {
    const regionModuleService = container.resolve(Modules.REGION)

    try {
        const regions = await regionModuleService.listRegions({}, { relations: ["countries"] })
        console.log("REGIONS WITH COUNTRIES:", JSON.stringify(regions, null, 2))
    } catch (e) {
        console.error("Inspection failed:", e.message)
    }
}
