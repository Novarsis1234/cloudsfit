const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function inspect() {
    try {
        await client.connect();

        console.log('\n--- Inspecting product ---');
        const res = await client.query('SELECT * FROM product LIMIT 1');
        if (res.rows.length > 0) {
            console.log('Keys in product:', Object.keys(res.rows[0]).join(', '));
        } else {
            const colRes = await client.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'product'
            `);
            console.log('Columns in product:', colRes.rows.map(r => r.column_name).join(', '));
        }

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

inspect();
