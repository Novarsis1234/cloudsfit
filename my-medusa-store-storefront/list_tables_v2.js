const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function listTables() {
    try {
        await client.connect();
        console.log('Connected to database.');

        const res = await client.query(\`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        \`);
        console.log('\n--- Tables ---');
        res.rows.forEach(row => console.log(row.table_name));

    } catch (err) {
        console.error('Error executing query:', err.stack);
    } finally {
        await client.end();
    }
}

listTables();
