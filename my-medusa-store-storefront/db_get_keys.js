const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function getKeys() {
    try {
        await client.connect();
        console.log('Connected to database.');

        const res = await client.query("SELECT * FROM api_key");
        console.log('\n--- api_key contents ---');
        console.log(JSON.stringify(res.rows, null, 2));

    } catch (err) {
        console.error('Error executing query:', err.message);
    } finally {
        await client.end();
    }
}

getKeys();
