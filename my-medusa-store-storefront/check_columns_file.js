const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function checkColumns() {
    try {
        await client.connect();
        const res = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'shipping_option' AND table_schema = 'public'");
        const columns = res.rows.map(r => `${r.column_name}: ${r.data_type}`).join('\n');
        fs.writeFileSync('shipping_option_columns.txt', columns);
        console.log('Columns written to shipping_option_columns.txt');
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

checkColumns();
