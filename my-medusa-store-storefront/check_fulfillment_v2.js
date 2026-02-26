const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function checkFulfillment() {
    try {
        await client.connect();
        console.log('Connected to database.');

        // List tables to find the right ones
        const tableRes = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND (table_name LIKE 'shipping_option%' OR table_name LIKE 'service_zone%' OR table_name LIKE 'fulfillment%')
        `);
        console.log('\n--- Fulfillment Related Tables ---');
        console.table(tableRes.rows.map(r => r.table_name));

        // Check shipping_option contents
        const soRes = await client.query('SELECT * FROM shipping_option LIMIT 10');
        console.log('\n--- shipping_option contents ---');
        console.table(soRes.rows);

        // Check service_zone
        const szRes = await client.query('SELECT * FROM service_zone LIMIT 10');
        console.log('\n--- service_zone contents ---');
        console.table(szRes.rows);

    } catch (err) {
        console.error('Error executing query:', err.stack);
    } finally {
        await client.end();
    }
}

checkFulfillment();
