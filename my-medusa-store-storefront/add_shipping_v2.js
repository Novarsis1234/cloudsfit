const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function addShipping() {
    try {
        await client.connect();
        console.log('Connected to database.');

        // Get the first region
        const regionRes = await client.query('SELECT id FROM region LIMIT 1');
        if (regionRes.rows.length === 0) {
            console.error('No regions found.');
            return;
        }
        const regionId = regionRes.rows[0].id;
        console.log('Using Region ID:', regionId);

        // Get a fulfillment set
        const fsRes = await client.query('SELECT id FROM fulfillment_set LIMIT 1');
        if (fsRes.rows.length === 0) {
            console.log('No fulfillment sets found. Checking for location...');
            const locRes = await client.query('SELECT id FROM stock_location LIMIT 1');
            if (locRes.rows.length === 0) {
                console.error('No stock locations found.');
                return;
            }
            console.log('Found Location, but need fulfillment set.');
            return;
        }
        const fulfillmentSetId = fsRes.rows[0].id;
        console.log('Using Fulfillment Set ID:', fulfillmentSetId);

        // Check for service zone
        const szRes = await client.query('SELECT id FROM service_zone WHERE fulfillment_set_id = $1 LIMIT 1', [fulfillmentSetId]);
        if (szRes.rows.length === 0) {
            console.error('No service zones found for this fulfillment set.');
            return;
        }
        const serviceZoneId = szRes.rows[0].id;
        console.log('Using Service Zone ID:', serviceZoneId);

        // Add shipping option
        const insertQuery = `
            INSERT INTO shipping_option (id, name, price_type, amount, is_tax_inclusive, service_zone_id, shipping_profile_id, provider_id, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
        `;

        // We need a shipping profile and provider
        const spRes = await client.query('SELECT id FROM shipping_profile LIMIT 1');
        const spId = spRes.rows[0]?.id || 'sp_default';

        const pRes = await client.query('SELECT id FROM fulfillment_provider LIMIT 1');
        const pId = pRes.rows[0]?.id || 'manual';

        await client.query(insertQuery, [
            'so_standard_' + Date.now(),
            'Standard Shipping',
            'flat',
            0,
            true,
            serviceZoneId,
            spId,
            pId
        ]);

        console.log('Added Standard Shipping option.');

    } catch (err) {
        console.error('Error executing query:', err.stack);
    } finally {
        await client.end();
    }
}

addShipping();
