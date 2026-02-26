const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function checkProfiles() {
    try {
        await client.connect();

        console.log('\n--- Product Profiles ---');
        const productRes = await client.query('SELECT id, title, shipping_profile_id FROM product');
        console.table(productRes.rows);

        console.log('\n--- Shipping Option Profiles ---');
        const optionRes = await client.query('SELECT id, name, shipping_profile_id FROM shipping_option');
        console.table(optionRes.rows);

        console.log('\n--- Shipping Profiles ---');
        const profileRes = await client.query('SELECT id, name FROM shipping_profile');
        console.table(profileRes.rows);

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

checkProfiles();
