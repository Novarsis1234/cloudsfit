const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function checkKeys() {
    try {
        await client.connect();
        const keys = await client.query("SELECT id, token, title, type FROM api_key");
        const links = await client.query("SELECT * FROM publishable_api_key_sales_channel");
        const channels = await client.query("SELECT id, name FROM sales_channel");

        let output = '=== API KEYS ===\n' + JSON.stringify(keys.rows, null, 2);
        output += '\n\n=== LINKS ===\n' + JSON.stringify(links.rows, null, 2);
        output += '\n\n=== CHANNELS ===\n' + JSON.stringify(channels.rows, null, 2);

        fs.writeFileSync('key_diagnostics.txt', output);
        console.log('Results written to key_diagnostics.txt');

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

checkKeys();
