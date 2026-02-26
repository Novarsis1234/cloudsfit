const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function listTables() {
    try {
        await client.connect();
        const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
        const tables = res.rows.map(r => r.table_name).join('\n');
        fs.writeFileSync('all_tables_v2.txt', tables);
        console.log('Tables written to all_tables_v2.txt');
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

listTables();
