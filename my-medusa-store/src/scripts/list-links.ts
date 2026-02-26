
import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function listLinks({ container }: { container: MedusaContainer }) {
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

    try {
        console.log("--- AVAILABLE LINKS ---")
        // @ts-ignore - accessing internal links to debug
        const links = remoteLink.modules_
        console.log(Object.keys(links))
    } catch (e) {
        console.error("Link listing failed:", e.message)
    }
}
