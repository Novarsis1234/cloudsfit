
import { MedusaContainer } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function updateIndiaRegion({ container }: { container: MedusaContainer }) {
    const regionModuleService = container.resolve(Modules.REGION)

    console.log("Updating India region countries...")

    try {
        const regions = await regionModuleService.listRegions({ name: "India" })
        if (regions.length === 0) {
            console.error("India region not found.")
            return
        }

        const region = regions[0]
        console.log("Found India region:", region.id)

        // In Medusa 2.0, updating region countries can be done via updateRegions
        // or sometimes through a link if it's a separate entity.
        // But for modules, updateRegions usually takes the country codes.
        await regionModuleService.updateRegions({
            id: region.id,
            countries: ["in"]
        })

        console.log("SUCCESS: Added 'in' to India region.")

        // Verify
        const updated = await regionModuleService.listRegions({ id: region.id }, { relations: ["countries"] })
        console.log("Updated Region:", JSON.stringify(updated, null, 2))
    } catch (e) {
        console.error("Update failed:", e.message)
    }
}
