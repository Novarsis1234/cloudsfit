const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function link() {
    try {
        await client.connect();

        const profiles = await client.query('SELECT id, name FROM shipping_profile LIMIT 1');
        if (profiles.rows.length === 0) {
            console.log('No profiles found');
            return;
        }
        const profileId = profiles.rows[0].id;
        console.log(`Linking products to profile: ${profileId} (${profiles.rows[0].name})`);

        const products = await client.query('SELECT id, title FROM product');
        console.log(`Found ${products.rows.length} products.`);

        const now = new Date().toISOString();
        for (const p of products.rows) {
            try {
                // Check if link exists
                const check = await client.query('SELECT 1 FROM product_shipping_profile WHERE product_id = $1 AND shipping_profile_id = $2', [p.id, profileId]);
                if (check.rows.length === 0) {
                    await client.query("INSERT INTO product_shipping_profile (product_id, shipping_profile_id, created_at, updated_at) VALUES ($1, $2, $3, $3)", [p.id, profileId, now]);
                    console.log(`Linked ${p.title}`);
                }
            } catch (e) {
                console.error(`Failed to link ${p.title}:`, e.message);
            }
        }

        // Also ensure shipping options use this profile
        const options = await client.query('SELECT id, name FROM shipping_option');
        for (const opt of options.rows) {
            await client.query('UPDATE shipping_option SET shipping_profile_id = $1 WHERE id = $2', [profileId, opt.id]);
            console.log(`Updated shipping option ${opt.name} to use profile ${profileId}`);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

link();
