const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function listColumns() {
    try {
        await client.connect();
        const res = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'product_variant'
        `);
        console.log('Columns in product_variant:', res.rows.map(r => r.column_name).join(', '));

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

listColumns();
