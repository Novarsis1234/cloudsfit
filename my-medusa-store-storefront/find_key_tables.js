const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function findKeyTables() {
    try {
        await client.connect();
        const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_name LIKE '%key%' AND table_schema = 'public'");
        console.log('--- KEY TABLES ---');
        res.rows.forEach(r => console.log(r.table_name));
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

findKeyTables();
