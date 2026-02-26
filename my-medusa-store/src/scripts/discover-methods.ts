import { MedusaContainer } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import * as fs from "fs"

export default async function discoverMethods({ container }: { container: MedusaContainer }) {
    const productModule = container.resolve(ModuleRegistrationName.PRODUCT)
    const pricingModule = container.resolve(ModuleRegistrationName.PRICING)
    const remoteLink = container.resolve("remoteLink") as any

    let output = ""
    output += "--- PRODUCT MODULE METHODS ---\n"
    output += Object.getOwnPropertyNames(Object.getPrototypeOf(productModule)).join(", ") + "\n"

    output += "\n--- PRICING MODULE METHODS ---\n"
    output += Object.getOwnPropertyNames(Object.getPrototypeOf(pricingModule)).join(", ") + "\n"

    if (remoteLink) {
        output += "\n--- REMOTE LINK METHODS ---\n"
        output += Object.getOwnPropertyNames(Object.getPrototypeOf(remoteLink)).join(", ") + "\n"
    }

    fs.writeFileSync("methods_info.txt", output)
    console.log("Written to methods_info.txt")
}
