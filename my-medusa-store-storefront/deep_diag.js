const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function runDeepDiag() {
    try {
        await client.connect();
        console.log('--- Deep Diagnostic ---');

        console.log('\n--- currencies ---');
        const currencies = await client.query('SELECT * FROM currency LIMIT 5');
        console.table(currencies.rows);

        console.log('\n--- countries ---');
        const countries = await client.query('SELECT * FROM country LIMIT 5');
        console.table(countries.rows);

        console.log('\n--- store ---');
        const store = await client.query('SELECT * FROM store');
        console.table(store.rows);

        console.log('\n--- region ---');
        const region = await client.query('SELECT * FROM region');
        console.table(region.rows);

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

runDeepDiag();
