const { Client } = require('pg');

const connectionString = 'postgresql://postgres:postgres@localhost:5432/medusa-test';

async function checkRegionTable() {
    const client = new Client({ connectionString });
    try {
        await client.connect();

        // Check if region table exists and its columns
        console.log('--- REGION TABLE COLUMNS ---');
        const columnsRes = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'region'
    `);
        console.log(JSON.stringify(columnsRes.rows, null, 2));

        // Try to count rows
        const countRes = await client.query('SELECT COUNT(*) FROM region');
        console.log('Total regions:', countRes.rows[0].count);

    } catch (err) {
        console.error('Error executing query', err.stack);
    } finally {
        await client.end();
    }
}

checkRegionTable();
