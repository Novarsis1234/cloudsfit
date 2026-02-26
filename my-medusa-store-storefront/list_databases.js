const { Client } = require('pg');

const connectionString = 'postgresql://postgres:postgres@localhost:5432/postgres'; // Connect to default postgres DB

async function listDatabases() {
    const client = new Client({ connectionString });
    try {
        await client.connect();
        const res = await client.query('SELECT datname FROM pg_database WHERE datistemplate = false');
        console.log('--- DATABASES ---');
        console.log(res.rows);
    } catch (err) {
        console.error('Error executing query', err.stack);
    } finally {
        await client.end();
    }
}

listDatabases();
