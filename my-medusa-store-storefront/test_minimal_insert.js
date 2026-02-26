const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function test() {
    try {
        await client.connect();

        const profiles = await client.query('SELECT id FROM shipping_profile LIMIT 1');
        const products = await client.query('SELECT id FROM product LIMIT 1');

        if (profiles.rows.length > 0 && products.rows.length > 0) {
            const pid = products.rows[0].id;
            const spid = profiles.rows[0].id;
            console.log(`Inserting pid=${pid}, spid=${spid}`);
            // Try without created_at/updated_at since they have defaults
            await client.query('INSERT INTO product_shipping_profile (product_id, shipping_profile_id) VALUES ($1, $2)', [pid, spid]);
            console.log('Success!');
        }

    } catch (err) {
        console.error('Error details:', err);
    } finally {
        await client.end();
    }
}

test();
