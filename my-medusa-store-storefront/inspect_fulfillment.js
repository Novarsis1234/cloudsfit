const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function inspect() {
    try {
        await client.connect();
        const tables = ['fulfillment_set', 'service_zone', 'geo_zone', 'shipping_option', 'fulfillment_provider', 'stock_location', 'location_fulfillment_set'];

        for (const table of tables) {
            console.log(`\n--- ${table} ---`);
            try {
                const res = await client.query(`SELECT * FROM ${table} LIMIT 1`);
                console.table(res.rows);
            } catch (e) {
                console.log(`Error reading ${table}: ${e.message}`);
            }
        }
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

inspect();
