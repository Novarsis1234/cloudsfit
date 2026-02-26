const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function list() {
    try {
        await client.connect();
        const tables = ['price_set', 'price_set_money_amount', 'money_amount', 'price_rule'];
        for (const table of tables) {
            const res = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name = $1`, [table]);
            console.log(`\n--- ${table.toUpperCase()} ---`);
            console.log(res.rows.map(r => r.column_name).join('\n'));
        }
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

list();
