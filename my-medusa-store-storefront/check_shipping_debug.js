const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function debug() {
    try {
        await client.connect();
        console.log('Connected to database.');

        console.log('\n--- Shipping Profiles ---');
        const profiles = await client.query('SELECT id, name, type FROM shipping_profile');
        console.table(profiles.rows);

        console.log('\n--- Fulfillment Providers ---');
        const providers = await client.query('SELECT id FROM fulfillment_provider');
        console.table(providers.rows);

        console.log('\n--- Shipping Options ---');
        const options = await client.query('SELECT id, name, price_type, service_zone_id, shipping_profile_id, provider_id FROM shipping_option');
        console.table(options.rows);

        console.log('\n--- Products and their Shipping Profiles ---');
        const products = await client.query('SELECT id, title, shipping_profile_id FROM product');
        console.table(products.rows);

        console.log('\n--- Service Zones and Geo Zones ---');
        const zones = await client.query('SELECT sz.id, sz.name, gz.country_code FROM service_zone sz LEFT JOIN geo_zone gz ON sz.id = gz.service_zone_id');
        console.table(zones.rows);

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

debug();
