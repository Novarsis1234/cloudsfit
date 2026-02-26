const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function check() {
    try {
        await client.connect();
        const res = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'product_shipping_profile'
        `);
        if (res.rows.length > 0) {
            console.log('product_shipping_profile exists. Columns:', res.rows.map(r => r.column_name).join(', '));
            const data = await client.query('SELECT * FROM product_shipping_profile LIMIT 5');
            console.table(data.rows);
        } else {
            console.log('product_shipping_profile does NOT exist.');
        }

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

check();
