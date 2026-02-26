const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function findIds() {
    try {
        await client.connect();

        console.log('--- Providers ---');
        const pRes = await client.query("SELECT id FROM fulfillment_provider");
        console.table(pRes.rows);

        console.log('--- Profiles ---');
        const spRes = await client.query("SELECT id FROM shipping_profile");
        console.table(spRes.rows);

        console.log('--- Regions ---');
        const rRes = await client.query("SELECT id, name FROM region");
        console.table(rRes.rows);

        console.log('--- Stock Locations ---');
        const lRes = await client.query("SELECT id, name FROM stock_location");
        console.table(lRes.rows);

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

findIds();
