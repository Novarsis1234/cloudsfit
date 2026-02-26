const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function list() {
    try {
        await client.connect();
        const res = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'shipping_option'
        `);
        console.log('Columns in shipping_option:');
        res.rows.forEach(r => console.log(r.column_name));

        const res2 = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'shipping_profile'
        `);
        console.log('\nColumns in shipping_profile:');
        res2.rows.forEach(r => console.log(r.column_name));

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

list();
