
import { MedusaContainer } from "@medusajs/types"

export default async function listAll({ container }: { container: MedusaContainer }) {
    const remoteQuery = container.resolve("remoteQuery")
    const log = (label: string, data: any) => {
        console.log(`--- ${label} ---`)
        console.log(JSON.stringify(data, null, 2))
    }

    // 1. Regions
    const regions = await remoteQuery({
        entryPoint: "region",
        fields: ["id", "name", "currency_code", "countries.iso_2"],
    })
    log("REGIONS", regions)

    // 2. Sales Channels
    const salesChannels = await remoteQuery({
        entryPoint: "sales_channel",
        fields: ["id", "name", "description"],
    })
    log("SALES CHANNELS", salesChannels)

    // 3. Stock Locations
    const locations = await remoteQuery({
        entryPoint: "stock_location",
        fields: ["id", "name", "address.city"],
    })
    log("STOCK LOCATIONS", locations)

    // 4. Products with Prices
    const products = await remoteQuery({
        entryPoint: "product",
        fields: [
            "id",
            "title",
            "variants.id",
            "variants.title"
        ],
    })
    log("PRODUCTS", products)
}
