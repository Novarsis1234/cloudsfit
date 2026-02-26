const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function list() {
    try {
        await client.connect();
        console.log('--- REGIONS ---');
        const r = await client.query('SELECT * FROM region');
        console.table(r.rows);

        console.log('\n--- REGION COUNTRIES ---');
        const rc = await client.query('SELECT * FROM region_country');
        console.table(rc.rows);
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

list();
