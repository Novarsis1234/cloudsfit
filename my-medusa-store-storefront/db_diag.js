const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function getDiagnosticData() {
    try {
        await client.connect();
        console.log('Connected to database.');

        console.log('\n--- api_key contents ---');
        const keys = await client.query("SELECT * FROM api_key");
        console.table(keys.rows);

        console.log('\n--- sales_channel contents ---');
        const channels = await client.query("SELECT * FROM sales_channel");
        console.table(channels.rows);

        console.log('\n--- api_key_sales_channel links ---');
        const links = await client.query("SELECT * FROM api_key_sales_channel");
        console.table(links.rows);

    } catch (err) {
        console.error('Error executing query:', err.message);
    } finally {
        await client.end();
    }
}

getDiagnosticData();
