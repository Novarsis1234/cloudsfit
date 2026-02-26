const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function checkProductLinks() {
    try {
        await client.connect();
        const res = await client.query("SELECT * FROM product_sales_channel");
        fs.writeFileSync('product_links.txt', JSON.stringify(res.rows, null, 2));
        console.log('Product links written to product_links.txt');
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

checkProductLinks();
