const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function listColumns() {
    try {
        await client.connect();
        const tables = ['shipping_profile', 'shipping_option', 'product', 'service_zone', 'geo_zone', 'fulfillment_set', 'fulfillment_provider'];

        for (const table of tables) {
            console.log(`\n--- Columns in ${table} ---`);
            const res = await client.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = $1
            `, [table]);
            console.table(res.rows);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

listColumns();
