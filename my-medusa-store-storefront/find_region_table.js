const { Client } = require('pg');

const connectionString = 'postgresql://postgres:postgres@localhost:5432/medusa-test';

async function listSchemasAndTables() {
    const client = new Client({ connectionString });
    try {
        await client.connect();

        console.log('--- SCHEMAS ---');
        const schemaRes = await client.query('SELECT schema_name FROM information_schema.schemata');
        console.log(schemaRes.rows);

        console.log('\n--- FINDING REGION TABLE ---');
        const tableRes = await client.query(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_name LIKE '%region%'
    `);
        console.log(tableRes.rows);

    } catch (err) {
        console.error('Error executing query', err.stack);
    } finally {
        await client.end();
    }
}

listSchemasAndTables();
