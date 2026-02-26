const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function checkCollections() {
    try {
        await client.connect();
        console.log('Connected to database.');

        const res = await client.query("SELECT id, title, handle FROM collection");
        console.log('\n--- Collections ---');
        console.table(res.rows);

    } catch (err) {
        console.error('Error executing query:', err.stack);
    } finally {
        await client.end();
    }
}

checkCollections();
