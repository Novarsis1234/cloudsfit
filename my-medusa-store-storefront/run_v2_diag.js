const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
    connectionString: 'postgres://postgres:Subhash1234@localhost:5432/my_db',
});

async function runDiagnostics() {
    let output = '';
    const log = (msg) => {
        console.log(msg);
        output += msg + '\n';
    };

    try {
        await client.connect();
        log('--- Database Connected ---');

        // 1. Check api_key table
        log('\n--- api_key contents ---');
        const apiKeys = await client.query('SELECT id, token, title, type, revoked_at, deleted_at FROM api_key');
        output += JSON.stringify(apiKeys.rows, null, 2) + '\n';

        // 2. Check sales_channel table
        log('\n--- sales_channel contents ---');
        const salesChannels = await client.query('SELECT id, name, is_disabled, deleted_at FROM sales_channel');
        output += JSON.stringify(salesChannels.rows, null, 2) + '\n';

        // 3. Find any association table
        log('\n--- Searching for association tables ---');
        const tablesRes = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%api_key%' AND table_name LIKE '%sales_channel%'");
        const linkTables = tablesRes.rows.map(r => r.table_name);
        log('Potential link tables: ' + linkTables.join(', '));

        for (const table of linkTables) {
            log(`\n--- Contents of ${table} ---`);
            const contents = await client.query(`SELECT * FROM ${table}`);
            output += JSON.stringify(contents.rows, null, 2) + '\n';
        }

        fs.writeFileSync('diag_output.txt', output);
        log('\nFull diagnostic details written to diag_output.txt');

    } catch (err) {
        log('Diagnostic error: ' + err.message);
    } finally {
        await client.end();
    }
}

runDiagnostics();
