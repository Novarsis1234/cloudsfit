const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function checkApiKey() {
    try {
        await client.connect();
        console.log('Connected to database.');

        const res = await client.query("SELECT * FROM api_key LIMIT 5");
        console.log('\n--- api_key Contents ---');
        console.table(res.rows);

        const res2 = await client.query("SELECT * FROM publishable_api_key_sales_channel LIMIT 5");
        console.log('\n--- publishable_api_key_sales_channel Contents ---');
        console.table(res2.rows);

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

checkApiKey();
