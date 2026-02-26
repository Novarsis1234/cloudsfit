const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function listTables() {
    try {
        await client.connect();
        const res = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);
        console.log('Tables in database:');
        console.log(res.rows.map(r => r.table_name).join('\n'));

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

listTables();
