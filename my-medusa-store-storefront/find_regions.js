const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function findRegionTables() {
    try {
        await client.connect();
        console.log('Connected to database.');

        const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_name LIKE '%region%' AND table_schema = 'public'");
        console.log('\n--- Region Related Tables ---');
        console.table(res.rows.map(r => r.table_name));

        for (const row of res.rows) {
            console.log(`\n--- Contents of ${row.table_name} ---`);
            const contents = await client.query(`SELECT * FROM ${row.table_name} LIMIT 5`);
            console.table(contents.rows);
        }

    } catch (err) {
        console.error('Error executing query:', err.stack);
    } finally {
        await client.end();
    }
}

findRegionTables();
