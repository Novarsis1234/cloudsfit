const { Client } = require('pg');

const connectionString = 'postgresql://postgres:postgres@localhost:5432/medusa-test';

async function checkRegions() {
    const client = new Client({ connectionString });
    try {
        await client.connect();
        console.log('--- PUBLIC.REGION ---');
        const res = await client.query('SELECT * FROM "public"."region"');
        console.log(res.rows);
    } catch (err) {
        console.error('Error executing query', err.stack);
    } finally {
        await client.end();
    }
}

checkRegions();
