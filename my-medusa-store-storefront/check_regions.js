const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function checkRegions() {
    try {
        await client.connect();
        console.log('Connected to database.');

        // Query for regions
        const res = await client.query('SELECT id, name, currency_code FROM region');
        console.log('\n--- Regions ---');
        console.table(res.rows);

    } catch (err) {
        console.error('Error executing query:', err.stack);
    } finally {
        await client.end();
    }
}

checkRegions();
