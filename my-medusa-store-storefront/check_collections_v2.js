const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function checkCollections() {
    try {
        await client.connect();
        const res = await client.query("SELECT id, title, handle FROM product_collection");
        fs.writeFileSync('collections_found.txt', JSON.stringify(res.rows, null, 2));
        console.log('Results written to collections_found.txt');
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

checkCollections();
