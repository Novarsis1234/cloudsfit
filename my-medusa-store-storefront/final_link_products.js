const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function link() {
    try {
        await client.connect();

        const profiles = await client.query('SELECT id FROM shipping_profile LIMIT 1');
        if (profiles.rows.length === 0) {
            console.log('No profiles found');
            return;
        }
        const profileId = profiles.rows[0].id;
        console.log(`Linking products to profile: ${profileId}`);

        const products = await client.query('SELECT id, title FROM product');
        console.log(`Found ${products.rows.length} products.`);

        const now = new Date().toISOString();
        for (const p of products.rows) {
            try {
                const check = await client.query('SELECT 1 FROM product_shipping_profile WHERE product_id = $1 AND shipping_profile_id = $2', [p.id, profileId]);
                if (check.rows.length === 0) {
                    const id = 'prodsp_' + Math.random().toString(36).substring(7);
                    await client.query("INSERT INTO product_shipping_profile (id, product_id, shipping_profile_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $4)", [id, p.id, profileId, now]);
                    console.log(`Linked ${p.title} with ID ${id}`);
                } else {
                    console.log(`${p.title} already linked.`);
                }
            } catch (e) {
                console.error(`Failed to link ${p.title}:`, e.message);
            }
        }

        console.log('Done!');

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

link();
