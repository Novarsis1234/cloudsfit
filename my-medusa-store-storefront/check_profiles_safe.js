const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function run() {
    try {
        await client.connect();

        console.log('\n--- Profiles ---');
        const profiles = await client.query('SELECT * FROM shipping_profile');
        console.table(profiles.rows);

        console.log('\n--- Products ---');
        const products = await client.query('SELECT * FROM product LIMIT 5');
        console.table(products.rows);

        console.log('\n--- Product-Profile Links ---');
        const links = await client.query('SELECT * FROM product_shipping_profile');
        console.table(links.rows);

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

run();
