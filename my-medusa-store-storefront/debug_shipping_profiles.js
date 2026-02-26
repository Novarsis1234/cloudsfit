const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function debug() {
    try {
        await client.connect();
        console.log('Connected to database.');

        console.log('\n--- Products and their Profiles ---');
        const products = await client.query('SELECT id, title, shipping_profile_id FROM product WHERE status = $1', ['published']);
        console.table(products.rows);

        console.log('\n--- Shipping Profiles ---');
        const profiles = await client.query('SELECT id, name, type FROM shipping_profile');
        console.table(profiles.rows);

        console.log('\n--- Shipping Options ---');
        const options = await client.query('SELECT id, name, shipping_profile_id, service_zone_id FROM shipping_option');
        console.table(options.rows);

        console.log('\n--- Regions ---');
        const regions = await client.query('SELECT id, name, currency_code FROM region');
        console.table(regions.rows);

        // In v2, countries are often in a separate table
        console.log('\n--- Try to find Region-Country link ---');
        try {
            const regionCountries = await client.query("SELECT * FROM region_country LIMIT 5");
            console.table(regionCountries.rows);
        } catch (e) {
            console.log('region_country table not found');
        }

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

debug();
