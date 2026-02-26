const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function debug() {
    try {
        await client.connect();
        console.log('--- DATABASE DEBUG (INDIA SHIPPING) ---');

        // 1. Check Regions
        const regions = await client.query('SELECT id, name, currency_code FROM region');
        console.log('\nREGIONS:');
        console.table(regions.rows);

        // 2. Check Countries for Regions
        const countries = await client.query(`
            SELECT r.name as region_name, rc.country_code 
            FROM region r 
            JOIN region_country rc ON r.id = rc.region_id
        `);
        console.log('\nREGION COUNTRIES:');
        console.table(countries.rows);

        // 3. Check Shipping Options
        const options = await client.query(`
            SELECT id, name, shipping_profile_id, service_zone_id, provider_id 
            FROM shipping_option
        `);
        console.log('\nSHIPPING OPTIONS:');
        console.table(options.rows);

        // 4. Check Service Zones and Geo Zones
        const zones = await client.query(`
            SELECT sz.id as sz_id, sz.name as sz_name, gz.country_code, gz.type as gz_type
            FROM service_zone sz
            LEFT JOIN geo_zone gz ON sz.id = gz.service_zone_id
        `);
        console.log('\nSERVICE & GEO ZONES:');
        console.table(zones.rows);

        // 5. Check if Shipping Profile is linked to products
        const links = await client.query('SELECT count(*) FROM product_shipping_profile');
        console.log(`\nPRODUCT-PROFILE LINKS COUNT: ${links.rows[0].count}`);

    } catch (err) {
        console.error('Error during debug:', err.message);
    } finally {
        await client.end();
    }
}

debug();
