const { Client } = require('pg');

const connectionString = 'postgresql://postgres:postgres@localhost:5432/medusa-test';

async function checkRegions() {
    const client = new Client({ connectionString });
    try {
        await client.connect();
        console.log('--- REGIONS ---');
        const res = await client.query('SELECT id, name, currency_code FROM region');
        console.log(res.rows);

        console.log('\n--- COUNTRIES ---');
        const countries = await client.query('SELECT iso_2, region_id FROM country WHERE region_id IS NOT NULL');
        console.log(countries.rows);

    } catch (err) {
        console.error('Error executing query', err.stack);
    } finally {
        await client.end();
    }
}

checkRegions();
