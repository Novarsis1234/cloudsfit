const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function run() {
    try {
        await client.connect();

        console.log('\n--- Profiles ---');
        const profiles = await client.query('SELECT id, name, type FROM shipping_profile');
        console.table(profiles.rows);

        if (profiles.rows.length === 0) {
            console.log('No shipping profiles found! Creating default profile...');
            const now = new Date().toISOString();
            await client.query("INSERT INTO shipping_profile (id, name, type, created_at, updated_at) VALUES ($1, $2, $3, $4, $4)", ['sp_default', 'Default Profile', 'default', now]);
            profiles.rows.push({ id: 'sp_default', name: 'Default Profile', type: 'default' });
        }

        const profileId = profiles.rows[0].id;
        console.log(`Using profile ID: ${profileId}`);

        console.log('\n--- Products ---');
        const products = await client.query('SELECT id, title FROM product');
        console.table(products.rows);

        console.log('\n--- Linking all products to first profile ---');
        const now = new Date().toISOString();
        for (const p of products.rows) {
            // Check if already linked
            const check = await client.query('SELECT 1 FROM product_shipping_profile WHERE product_id = $1 AND shipping_profile_id = $2', [p.id, profileId]);
            if (check.rows.length === 0) {
                await client.query("INSERT INTO product_shipping_profile (product_id, shipping_profile_id, created_at, updated_at) VALUES ($1, $2, $3, $3)", [p.id, profileId, now]);
                console.log(`Linked product ${p.title} (${p.id}) to profile ${profileId}`);
            } else {
                console.log(`Product ${p.title} already linked.`);
            }
        }

        console.log('\n--- Verifying Shipping Option Profile ---');
        const options = await client.query('SELECT id, name, shipping_profile_id FROM shipping_option');
        console.table(options.rows);
        for (const opt of options.rows) {
            if (opt.shipping_profile_id !== profileId) {
                console.log(`Updating shipping option ${opt.name} to use profile ${profileId}`);
                await client.query("UPDATE shipping_option SET shipping_profile_id = $1 WHERE id = $2", [profileId, opt.id]);
            }
        }

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

run();
