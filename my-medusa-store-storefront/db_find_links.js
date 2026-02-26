const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function findLinks() {
    try {
        await client.connect();
        console.log('Connected to database.');

        const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        const tables = res.rows.map(r => r.table_name);

        console.log('\n--- Link/Relation Tables ---');
        const matches = tables.filter(t => (t.includes('api_key') || t.includes('sales_channel')) && t.includes('_'));
        console.table(matches);

        for (const table of matches) {
            try {
                console.log(`\n--- Contents of ${table} ---`);
                const data = await client.query(`SELECT * FROM ${table}`);
                console.table(data.rows);
            } catch (e) {
                console.log(`Error reading ${table}: ${e.message}`);
            }
        }

    } catch (err) {
        console.error('Error executing query:', err.message);
    } finally {
        await client.end();
    }
}

findLinks();
