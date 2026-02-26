const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function seed() {
    try {
        await client.connect();
        console.log('Connected to database.');

        // Get existing IDs
        const regionRes = await client.query("SELECT id FROM region LIMIT 1");
        const regionId = regionRes.rows[0]?.id;

        const locRes = await client.query("SELECT id FROM stock_location LIMIT 1");
        const locId = locRes.rows[0]?.id;

        const spRes = await client.query("SELECT id FROM shipping_profile LIMIT 1");
        const spId = spRes.rows[0]?.id || 'sp_default';

        const pRes = await client.query("SELECT id FROM fulfillment_provider LIMIT 1");
        const pId = pRes.rows[0]?.id || 'manual';

        if (!regionId || !locId) {
            console.error('Missing region or location.');
            return;
        }

        const now = new Date().toISOString();
        const fsId = 'fs_' + Math.random().toString(36).substring(7);
        const szId = 'sz_' + Math.random().toString(36).substring(7);
        const gzId = 'gz_' + Math.random().toString(36).substring(7);
        const soId = 'so_' + Math.random().toString(36).substring(7);

        // 1. Fulfillment Set
        await client.query("INSERT INTO fulfillment_set (id, name, type, created_at, updated_at) VALUES ($1, $2, $3, $4, $4)", [fsId, 'Standard FS', 'shipping', now]);

        // 2. Link to Location
        await client.query("INSERT INTO location_fulfillment_set (fulfillment_set_id, stock_location_id) VALUES ($1, $2)", [fsId, locId]);

        // 3. Service Zone
        await client.query("INSERT INTO service_zone (id, name, fulfillment_set_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $4)", [szId, 'Standard Zone', fsId, now]);

        // 4. Geo Zone (India)
        await client.query("INSERT INTO geo_zone (id, type, country_code, service_zone_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $5)", [gzId, 'country', 'in', szId, now]);

        // 5. Shipping Option
        // Note: Using price_type 'flat' might need a price set, but let's try 'calculated' first to see if it shows up
        await client.query("INSERT INTO shipping_option (id, name, price_type, service_zone_id, shipping_profile_id, provider_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $7)", [soId, 'Standard Shipping', 'flat', szId, spId, pId, now]);

        console.log('Seeded shipping option:', soId);
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}

seed();
