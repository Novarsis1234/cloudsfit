
import { MedusaContainer } from "@medusajs/framework/types"

export default async function listContainerKeys({ container }: { container: MedusaContainer }) {
    // @ts-ignore
    const registrations = container.registrations
    const keys = Object.keys(registrations).sort()

    console.log("--- CONTAINER KEYS ---")
    console.log(JSON.stringify(keys, null, 2))

    // Look specifically for anything containing "link" or "Module"
    const linkKeys = keys.filter(k => k.toLowerCase().includes("link"))
    console.log("--- LINK RELATED KEYS ---")
    console.log(JSON.stringify(linkKeys, null, 2))
}
