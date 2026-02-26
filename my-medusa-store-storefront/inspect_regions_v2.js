const { Client } = require('pg');

const connectionString = 'postgresql://postgres:postgres@localhost:5432/medusa-test';

async function checkRegions() {
    const client = new Client({ connectionString });
    try {
        await client.connect();

        // Check region table
        console.log('--- REGION TABLE ---');
        const regionRes = await client.query('SELECT * FROM region');
        console.log(JSON.stringify(regionRes.rows, null, 2));

        // Check region_country table (Medusa v2 specific)
        console.log('\n--- REGION_COUNTRY TABLE ---');
        try {
            const countryRes = await client.query('SELECT * FROM region_country');
            console.log(JSON.stringify(countryRes.rows, null, 2));
        } catch (e) {
            console.log('region_country table error or missing:', e.message);
        }

    } catch (err) {
        console.error('Error executing query', err.stack);
    } finally {
        await client.end();
    }
}

checkRegions();
