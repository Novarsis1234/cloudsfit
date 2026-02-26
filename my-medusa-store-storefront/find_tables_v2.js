const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function findTables() {
    try {
        await client.connect();
        console.log('Connected to database.');

        const res = await client.query("SELECT table_name FROM information_schema.tables WHERE (table_name LIKE '%product%' OR table_name LIKE '%collection%') AND table_schema = 'public'");

        let output = '--- Relevant Tables ---\n';
        res.rows.forEach(r => {
            output += r.table_name + '\n';
        });

        fs.writeFileSync('tables_found.txt', output);
        console.log('Results written to tables_found.txt');

    } catch (err) {
        console.error('Error executing query:', err.stack);
    } finally {
        await client.end();
    }
}

findTables();
