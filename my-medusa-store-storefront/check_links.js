const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function checkLinks() {
    try {
        await client.connect();
        console.log('Connected to database.');

        // Find active publishable key and its sales channel
        const keyRes = await client.query(`
      SELECT pk.id, pk.token, link.sales_channel_id 
      FROM publishable_api_key pk
      LEFT JOIN publishable_api_key_sales_channel link ON pk.id = link.publishable_key_id
      WHERE pk.token = 'pk_1fd48de7f62029167642428cc7a588e21e634e8f41b240f5b391bae65693a3a3'
    `);

        console.log('\n--- Publishable Key & Channel ---');
        console.table(keyRes.rows);

        if (keyRes.rows.length > 0 && keyRes.rows[0].sales_channel_id) {
            const channelId = keyRes.rows[0].sales_channel_id;

            // Check if products are linked to this channel
            const linkRes = await client.query(`
        SELECT count(*) FROM product_sales_channel WHERE sales_channel_id = $1
      `, [channelId]);

            console.log(`\nProducts linked to channel ${channelId}: ${linkRes.rows[0].count}`);

            if (linkRes.rows[0].count === '0') {
                console.log('\n--- ALL PRODUCT LINKS ---');
                const allLinks = await client.query('SELECT * FROM product_sales_channel LIMIT 10');
                console.table(allLinks.rows);

                console.log('\n--- ALL SALES CHANNELS ---');
                const allChannels = await client.query('SELECT id, name FROM sales_channel');
                console.table(allChannels.rows);
            }
        } else {
            console.log('No sales channel found for this key!');
        }

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

checkLinks();
