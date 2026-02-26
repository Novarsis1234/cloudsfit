const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function inspect() {
    try {
        await client.connect();

        console.log('\n--- Inspecting shipping_option ---');
        const res = await client.query('SELECT * FROM shipping_option LIMIT 1');
        if (res.rows.length > 0) {
            console.log('Keys in shipping_option:', Object.keys(res.rows[0]).join(', '));
            console.table(res.rows);
        } else {
            console.log('No rows in shipping_option');
            // List columns another way
            const colRes = await client.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'shipping_option'
            `);
            console.log('Columns in shipping_option:', colRes.rows.map(r => r.column_name).join(', '));
        }

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

inspect();
