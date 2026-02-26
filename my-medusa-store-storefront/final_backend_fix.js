const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function runFix() {
    try {
        await client.connect();
        console.log('--- FINAL BACKEND FIX ---');

        const now = new Date().toISOString();

        // 1. Ensure Region 'India' exists
        let regionRes = await client.query("SELECT id FROM region WHERE name ILIKE 'India' LIMIT 1");
        let regionId;
        if (regionRes.rows.length === 0) {
            regionId = 'reg_india_' + Math.random().toString(36).substring(7);
            await client.query("INSERT INTO region (id, name, currency_code, created_at, updated_at) VALUES ($1, $2, $3, $4, $4)", [regionId, 'India', 'inr', now]);
        } else {
            regionId = regionRes.rows[0].id;
        }
        console.log('Region ID:', regionId);

        // 2. Link 'in' to region
        await client.query("DELETE FROM region_country WHERE iso_2 = 'in'");
        const rcId = 'rc_india_' + Math.random().toString(36).substring(7);
        await client.query("INSERT INTO region_country (id, region_id, iso_2, created_at, updated_at) VALUES ($1, $2, $3, $4, $4)", [rcId, regionId, 'in', now]);
        console.log('Country linked.');

        // 3. Shipping Profile
        let profileRes = await client.query("SELECT id FROM shipping_profile LIMIT 1");
        let profileId = profileRes.rows[0].id;

        // 4. Products link
        const products = await client.query('SELECT id FROM product');
        for (const p of products.rows) {
            const check = await client.query('SELECT 1 FROM product_shipping_profile WHERE product_id = $1 AND shipping_profile_id = $2', [p.id, profileId]);
            if (check.rows.length === 0) {
                const id = 'prodsp_' + Math.random().toString(36).substring(7);
                await client.query("INSERT INTO product_shipping_profile (id, product_id, shipping_profile_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $4)", [id, p.id, profileId, now]);
            }
        }
        console.log('Products linked.');

        // 5. Fulfillment Set & Zone
        const fsId = 'fs_india_final';
        const szId = 'sz_india_final';
        await client.query("DELETE FROM location_fulfillment_set WHERE fulfillment_set_id = $1", [fsId]);
        await client.query("DELETE FROM geo_zone WHERE service_zone_id = $1", [szId]);
        await client.query("DELETE FROM service_zone WHERE id = $1", [szId]);
        await client.query("DELETE FROM fulfillment_set WHERE id = $1", [fsId]);

        await client.query("INSERT INTO fulfillment_set (id, name, type, created_at, updated_at) VALUES ($1, $2, $3, $4, $4)", [fsId, 'India Final', 'shipping', now]);
        const locRes = await client.query("SELECT id FROM stock_location LIMIT 1");
        if (locRes.rows.length > 0) {
            await client.query("INSERT INTO location_fulfillment_set (fulfillment_set_id, stock_location_id) VALUES ($1, $2)", [fsId, locRes.rows[0].id]);
        }
        await client.query("INSERT INTO service_zone (id, name, fulfillment_set_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $4)", [szId, 'India Zone', fsId, now]);
        const gzId = 'gz_in_' + Math.random().toString(36).substring(7);
        await client.query("INSERT INTO geo_zone (id, type, country_code, service_zone_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $5)", [gzId, 'country', 'in', szId, now]);
        console.log('Zones created.');

        // 6. Shipping Option
        let providerId = 'manual';
        const soId = 'so_india_' + Math.random().toString(36).substring(7);
        // NO amount column here.
        await client.query("INSERT INTO shipping_option (id, name, price_type, service_zone_id, shipping_profile_id, provider_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $7)",
            [soId, 'Express Shipping', 'flat', szId, profileId, providerId, now]);

        console.log('Shipping Option created.');
        console.log('--- COMPLETE ---');

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

runFix();
