const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function checkPrices() {
    try {
        await client.connect();
        console.log('Connected to database.');

        const res = await client.query("SELECT * FROM price LIMIT 5");
        console.log('\n--- Prices ---');
        console.table(res.rows);

    } catch (err) {
        console.error('Error executing query:', err.message);
    } finally {
        await client.end();
    }
}

checkPrices();
