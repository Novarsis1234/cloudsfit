const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function inspect() {
    try {
        await client.connect();

        const res = await client.query('SELECT * FROM product_shipping_profile LIMIT 0');
        console.log('Fields in product_shipping_profile:', res.fields.map(f => f.name).join(', '));

        for (const f of res.fields) {
            console.log(`Field: ${f.name}`);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

inspect();
