const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function listAllTables() {
    try {
        await client.connect();
        const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        const tables = res.rows.map(r => r.table_name).sort();
        fs.writeFileSync('all_tables.txt', tables.join('\n'));
        console.log('All tables written to all_tables.txt');
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

listAllTables();
