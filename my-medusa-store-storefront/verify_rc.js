const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function verify() {
    try {
        await client.connect();
        const res = await client.query(`
            SELECT r.id as region_id, r.name as region_name, rc.iso_2 
            FROM region r 
            LEFT JOIN region_country rc ON r.id = rc.region_id 
            WHERE rc.iso_2 = 'in'
        `);
        console.table(res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

verify();
