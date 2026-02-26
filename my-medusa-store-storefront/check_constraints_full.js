const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function check() {
    try {
        await client.connect();
        const res = await client.query(`
            SELECT column_name, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'product_shipping_profile'
        `);
        for (const row of res.rows) {
            console.log(`${row.column_name}: Nullable=${row.is_nullable}, Default=${row.column_default}`);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

check();
