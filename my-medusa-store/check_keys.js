
import {
    createConnection,
} from "typeorm"

async function run() {
    const connection = await createConnection({
        type: "postgres",
        url: "postgres://postgres:Subhash1234@localhost:5432/my_db",
        entities: [],
        logging: false,
    })

    try {
        const keys = await connection.query("SELECT * FROM publishable_api_key")
        console.log("Publishable API Keys:")
        console.table(keys)

        const links = await connection.query("SELECT * FROM publishable_api_key_sales_channel")
        console.log("Key <-> Sales Channel Links:")
        console.table(links)

    } catch (error) {
        console.error("Error querying database:", error)
    } finally {
        await connection.close()
    }
}

run()
