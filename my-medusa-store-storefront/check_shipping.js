const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function checkShipping() {
    try {
        await client.connect();
        console.log('Connected to database.');

        // Query for shipping options
        const res = await client.query(`
            SELECT id, name, price_type, amount, is_tax_inclusive 
            FROM shipping_option
        `);
        console.log('\n--- Shipping Options ---');
        console.table(res.rows);

        // Check if there are any shipping options linked to regions
        // In v2, it's more complex, but let's see if we can find any links
        const regions = await client.query('SELECT id, name FROM region');
        console.log('\n--- Regions ---');
        console.table(regions.rows);

    } catch (err) {
        console.error('Error executing query:', err.stack);
    } finally {
        await client.end();
    }
}

checkShipping();
