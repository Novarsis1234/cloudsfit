const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function runFix() {
    try {
        await client.connect();
        console.log('--- CORRECTED FIX: INDIA SHIPPING ---');

        const now = new Date().toISOString();

        // 1. Ensure Region 'India' exists
        let regionRes = await client.query("SELECT id FROM region WHERE name ILIKE 'India' LIMIT 1");
        let regionId;
        if (regionRes.rows.length === 0) {
            regionId = 'reg_india_' + Math.random().toString(36).substring(7);
            await client.query("INSERT INTO region (id, name, currency_code, created_at, updated_at) VALUES ($1, $2, $3, $4, $4)", [regionId, 'India', 'inr', now]);
            console.log('Created Region: India');
        } else {
            regionId = regionRes.rows[0].id;
            console.log('Found existing Region: India');
        }

        // 2. Link 'in' iso_2 to India region
        let rcRes = await client.query("SELECT id FROM region_country WHERE iso_2 = 'in'");
        if (rcRes.rows.length === 0) {
            const rcId = 'rc_' + Math.random().toString(36).substring(7);
            await client.query("INSERT INTO region_country (id, region_id, iso_2, created_at, updated_at) VALUES ($1, $2, $3, $4, $4)", [rcId, regionId, 'in', now]);
            console.log('Linked country "in" to region.');
        } else {
            await client.query("UPDATE region_country SET region_id = $1 WHERE iso_2 = 'in'", [regionId]);
            console.log('Updated existing country "in" link to India region.');
        }

        // 3. Ensure a Shipping Profile exists
        let profileRes = await client.query("SELECT id FROM shipping_profile LIMIT 1");
        let profileId;
        if (profileRes.rows.length === 0) {
            profileId = 'sp_default';
            await client.query("INSERT INTO shipping_profile (id, name, type, created_at, updated_at) VALUES ($1, $2, $3, $4, $4)", [profileId, 'Default Profile', 'default', now]);
            console.log('Created Default Shipping Profile.');
        } else {
            profileId = profileRes.rows[0].id;
            console.log('Using profile:', profileId);
        }

        // 4. Link all products to this profile
        const products = await client.query('SELECT id, title FROM product');
        console.log(`Linking ${products.rows.length} products...`);
        for (const p of products.rows) {
            const check = await client.query('SELECT 1 FROM product_shipping_profile WHERE product_id = $1 AND shipping_profile_id = $2', [p.id, profileId]);
            if (check.rows.length === 0) {
                const linkId = 'prodsp_' + Math.random().toString(36).substring(7);
                await client.query("INSERT INTO product_shipping_profile (id, product_id, shipping_profile_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $4)", [linkId, p.id, profileId, now]);
            }
        }
        console.log('Products linked.');

        // 5. Fulfillment Provider
        let fpRes = await client.query("SELECT id FROM fulfillment_provider LIMIT 1");
        let providerId = fpRes.rows.length > 0 ? fpRes.rows[0].id : 'manual';
        console.log('Using provider:', providerId);

        // 6. Fulfillment Set & Service Zone
        const fsId = 'fs_india_standard';
        const szId = 'sz_india_standard';

        await client.query("DELETE FROM location_fulfillment_set WHERE fulfillment_set_id = $1", [fsId]);
        await client.query("DELETE FROM geo_zone WHERE service_zone_id = $1", [szId]);
        await client.query("DELETE FROM service_zone WHERE id = $1", [szId]);
        await client.query("DELETE FROM fulfillment_set WHERE id = $1", [fsId]);

        await client.query("INSERT INTO fulfillment_set (id, name, type, created_at, updated_at) VALUES ($1, $2, $3, $4, $4)", [fsId, 'India Fulfillment', 'shipping', now]);

        const locRes = await client.query("SELECT id FROM stock_location LIMIT 1");
        if (locRes.rows.length > 0) {
            await client.query("INSERT INTO location_fulfillment_set (fulfillment_set_id, stock_location_id) VALUES ($1, $2)", [fsId, locRes.rows[0].id]);
        }

        await client.query("INSERT INTO service_zone (id, name, fulfillment_set_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $4)", [szId, 'India Zone', fsId, now]);

        const gzId = 'gz_india_' + Math.random().toString(36).substring(7);
        await client.query("INSERT INTO geo_zone (id, type, country_code, service_zone_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $5)", [gzId, 'country', 'in', szId, now]);
        console.log('Service Zone & Geo Zone created.');

        // 7. Shipping Option
        const soId = 'so_india_standard_val';
        await client.query("DELETE FROM shipping_option WHERE id = $1", [soId]);
        await client.query("INSERT INTO shipping_option (id, name, price_type, service_zone_id, shipping_profile_id, provider_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $7)",
            [soId, 'Standard Shipping', 'flat', szId, profileId, providerId, now]);

        // Ensure shipping_option_price exists or similar if needed for 'flat'
        // In v2 it's often linked via price_set but let's see if this is enough to show up
        console.log('Created Shipping Option: Standard Shipping');

        console.log('--- DONE ---');

    } catch (err) {
        console.error('ERROR:', err);
    } finally {
        await client.end();
    }
}

runFix();
