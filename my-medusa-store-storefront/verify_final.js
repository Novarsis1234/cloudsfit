const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function verify() {
    try {
        await client.connect();

        console.log('\n--- Profiles ---');
        const profiles = await client.query('SELECT id, name FROM shipping_profile');
        console.table(profiles.rows);

        console.log('\n--- Shipping Options ---');
        const options = await client.query('SELECT id, name, shipping_profile_id FROM shipping_option');
        console.table(options.rows);

        console.log('\n--- Products in product_shipping_profile ---');
        const links = await client.query('SELECT count(*) FROM product_shipping_profile');
        console.log(`Total links: ${links.rows[0].count}`);

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

verify();
