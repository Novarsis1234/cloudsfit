const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function fixFulfillment() {
    try {
        await client.connect();
        console.log('Connected to database.');

        // 1. Get Region
        const regionRes = await client.query("SELECT id FROM region WHERE name = 'India' OR currency_code = 'inr' LIMIT 1");
        const regionId = regionRes.rows[0]?.id;
        if (!regionId) {
            console.error('India region not found.');
            return;
        }
        console.log('Region ID:', regionId);

        // 2. Get Stock Location
        const locRes = await client.query("SELECT id FROM stock_location LIMIT 1");
        const locationId = locRes.rows[0]?.id;
        if (!locationId) {
            console.error('No stock location found.');
            return;
        }
        console.log('Location ID:', locationId);

        // 3. Create Fulfillment Set if missing
        let fsId = 'fs_' + Date.now();
        await client.query("INSERT INTO fulfillment_set (id, name, type, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())", [fsId, 'Default Fulfillment Set', 'shipping']);

        // 4. Link Fulfillment Set to Stock Location
        await client.query("INSERT INTO fulfillment_set_location (fulfillment_set_id, location_id) VALUES ($1, $2)", [fsId, locationId]);

        // 5. Create Service Zone
        let szId = 'sz_' + Date.now();
        await client.query("INSERT INTO service_zone (id, name, fulfillment_set_id, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())", [szId, 'India Zone', fsId]);

        // 6. Link Service Zone to Region (Check if table exists)
        // In some v2 versions it's different, let's try direct link if possible or check table first
        // Usually it's via geo_zone in the service_zone
        await client.query("INSERT INTO geo_zone (id, type, country_code, service_zone_id, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())", ['gz_' + Date.now(), 'country', 'in', szId]);

        // 7. Create Shipping Option
        let soId = 'so_' + Date.now();
        // Need a shipping profile
        const spRes = await client.query("SELECT id FROM shipping_profile LIMIT 1");
        let spId = spRes.rows[0]?.id;
        if (!spId) {
            spId = 'sp_default';
            await client.query("INSERT INTO shipping_profile (id, name, type, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())", [spId, 'Default Profile', 'default']);
        }

        await client.query(\`
            INSERT INTO shipping_option (id, name, price_type, amount, is_tax_inclusive, service_zone_id, shipping_profile_id, provider_id, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
        \`, [soId, 'Standard Shipping', 'flat', 0, true, szId, spId, 'manual']);

        console.log('Successfully created fulfillment infrastructure and shipping option.');

    } catch (err) {
        console.error('Error executing query:', err.stack);
    } finally {
        await client.end();
    }
}

fixFulfillment();
