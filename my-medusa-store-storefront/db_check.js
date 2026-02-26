const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function findTables() {
    try {
        await client.connect();
        console.log('Connected to database.');

        const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        const tables = res.rows.map(r => r.table_name);

        console.log('\n--- API Key Related ---');
        console.table(tables.filter(t => t.includes('api_key')));

        console.log('\n--- Sales Channel Related ---');
        console.table(tables.filter(t => t.includes('sales_channel')));

    } catch (err) {
        console.error('Error executing query:', err.stack);
    } finally {
        await client.end();
    }
}

findTables();
